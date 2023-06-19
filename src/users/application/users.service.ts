import { Injectable } from '@nestjs/common';
import { UsersRepository } from '../infrastructure/users.repository';
import { UserInputModel } from '../api/models/input/user.input.model';
import { UserViewModel } from '../api/models/view/user.view.model';
import * as bcrypt from 'bcrypt';
import { EmailsManager } from '../../managers/email.sender.manager';
import { User } from '../infrastructure/users.schema';
import { v4 as uuidv4 } from 'uuid';
import { add } from 'date-fns';

@Injectable()
export class UsersService {
  constructor(
    private usersRepository: UsersRepository,
    private EmailManager: EmailsManager,
  ) {}

  async createUser(
    inputUserData: UserInputModel,
  ): Promise<UserViewModel | null | 'email' | 'login'> {
    const { login, password, email } = inputUserData;

    const credentialsUnique = await this.checkIfCredentialsUnique(login, email);

    if (credentialsUnique) return credentialsUnique; //returns the name of field for future error

    const passwordSalt = await bcrypt?.genSalt(10);
    const passwordHash = await this._generateHash(password, passwordSalt);

    const user: User = {
      login,
      email,
      createdAt: new Date().toISOString(),
      passwordHash,
      emailConfirmation: {
        confirmationCode: uuidv4(),
        expirationDate: add(new Date(), { minutes: 30 }).toISOString(),
        isConfirmed: false,
      },
      banInfo: {
        isBanned: false,
        banDate: null,
        banReason: null,
      },
    };

    const createdUser = await this.usersRepository.insertUser(user);

    try {
      await this.EmailManager.sendEmailConfirmationCode(
        user.email,
        user.emailConfirmation.confirmationCode,
      );
    } catch (e) {
      console.error(e);
      await this.usersRepository.deleteUser(createdUser._id.toString());
      return null;
    }

    return {
      id: createdUser._id.toString(),
      login,
      email,
      createdAt: user.createdAt,
      banInfo: user.banInfo,
    };
  }

  async confirmEmail(code: string): Promise<boolean | null> {
    const user = await this.usersRepository.findUserByConfirmationCode(code);

    if (!user) return null;
    if (user.emailConfirmation.isConfirmed) return null;
    if (new Date(user.emailConfirmation.expirationDate) < new Date())
      return null;

    const result = await this.usersRepository.updateConfirmationStatus(
      user._id,
    );

    return result;
  }

  async resendConfirmationCode(searchTerm: string): Promise<boolean | null> {
    const user = await this.usersRepository.findUserByEmailOrLogin(searchTerm);

    if (!user) return null;
    if (user.emailConfirmation.isConfirmed) return null;
    const newConfirmationCode = uuidv4();

    try {
      await this.usersRepository.updateConfirmationCode(
        user._id,
        newConfirmationCode,
      );
      await this.EmailManager.sendEmailConfirmationCode(
        user.email,
        newConfirmationCode,
      );
      return true;
    } catch (e) {
      console.error(e);
      return null;
    }
  }

  async deleteUser(userId: string) {
    const deletedUser = await this.usersRepository.deleteUser(userId);

    return deletedUser.deletedCount === 1;
  }

  async sendEmailToResetPassword(email): Promise<boolean | null> {
    const user = await this.usersRepository.findUserByEmail(email);
    if (!user) return null;

    const confirmationCode = uuidv4();

    const recoveryCodeObject = {
      confirmationCode,
      email,
      isUsed: false,
      creationDate: new Date().toISOString(),
    };

    try {
      const result = await this.usersRepository.addRecoveryConfirmationCode(
        recoveryCodeObject,
      );
      if (!result) return null;

      await this.EmailManager.sendPasswordRecoveryCode(
        user.email,
        confirmationCode,
      );
      return true;
    } catch (e) {
      console.error(e);
      return null;
    }
  }

  async setNewPassword(recoveryData): Promise<boolean | null> {
    const result = await this.usersRepository.findRecoveryConfirmationCode(
      recoveryData.recoveryCode,
    );

    if (!result) return null;
    if (result.isUsed) return null;

    const passwordSalt = await bcrypt?.genSalt(10);
    const passwordHash = await this._generateHash(
      recoveryData.newPassword,
      passwordSalt,
    );

    const updateHash = await this.usersRepository.updateHash(
      result.email,
      passwordHash,
    );

    if (!updateHash) return null;

    const changedStatus = await this.usersRepository.changeRecoveryCodeStatus(
      result._id,
    );
    if (!changedStatus) return null;

    return true;
  }

  async checkIfCredentialsUnique(
    login: string,
    email: string,
  ): Promise<null | 'login' | 'email'> {
    const isLoginAlreadyExists = await this.usersRepository.findUserByLogin(
      login,
    );
    if (isLoginAlreadyExists) return 'login';

    const isEmailAlreadyExists = await this.usersRepository.findUserByEmail(
      email,
    );
    if (isEmailAlreadyExists) return 'email';

    return null;
  }

  private async _generateHash(pass: string, salt: string): Promise<string> {
    return await bcrypt.hash(pass, salt);
  }
}

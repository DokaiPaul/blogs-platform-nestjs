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
    };
  }

  async confirmEmail(code: string) {
    return null;
  }

  async resendConfirmationCode(email: string) {
    return null;
  }

  async deleteUser(userId: string) {
    const deletedUser = await this.usersRepository.deleteUser(userId);

    return deletedUser.deletedCount === 1;
  }

  async sendEmailToResetPassword(email) {
    return null;
  }

  async setNewPassword(recoveryData) {
    return null;
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

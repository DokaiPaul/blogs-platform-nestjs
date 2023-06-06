import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from './users.schema';
import { Model } from 'mongoose';
import { ObjectId } from 'mongodb';
import {
  PasswordRecovery,
  PasswordRecoveryDocument,
} from './password.recovery.schema';

@Injectable()
export class UsersRepository {
  constructor(
    @InjectModel(User.name) private UserModel: Model<UserDocument>,
    @InjectModel(PasswordRecovery.name)
    private PasswordRecoveryModel: Model<PasswordRecoveryDocument>,
  ) {}

  async insertUser(newUser: User) {
    const user = await new this.UserModel(newUser);
    return user.save();
  }

  async findUserByLogin(login: string) {
    return this.UserModel.findOne({ login: login });
  }

  async findUserByEmail(email: string) {
    return this.UserModel.findOne({ email: email });
  }

  async deleteUser(userId) {
    return this.UserModel.deleteOne({ _id: new ObjectId(userId) });
  }

  async findUserByConfirmationCode(code: string) {
    return this.UserModel.findOne({
      'emailConfirmation.confirmationCode': code,
    });
  }

  async updateConfirmationStatus(userId: ObjectId): Promise<boolean> {
    const user = await this.UserModel.findById(userId);

    user.emailConfirmation.isConfirmed = true;

    try {
      user.save();
      return true;
    } catch (e) {
      console.error(e);
      return null;
    }
  }

  async findUserByEmailOrLogin(
    searchTerm: string,
  ): Promise<UserDocument | null> {
    return this.UserModel.findOne({
      $or: [{ email: searchTerm }, { login: searchTerm }],
    });
  }

  async updateConfirmationCode(
    userId: ObjectId,
    confirmationCode: string,
  ): Promise<boolean | null> {
    const user = await this.UserModel.findById(userId);

    user.emailConfirmation.confirmationCode = confirmationCode;

    try {
      user.save();
      return true;
    } catch (e) {
      console.error(e);
      return null;
    }
  }

  async addRecoveryConfirmationCode(recoveryCodeObject: PasswordRecovery) {
    return this.PasswordRecoveryModel.create(recoveryCodeObject);
  }

  async findRecoveryConfirmationCode(
    recoveryCode: string,
  ): Promise<PasswordRecoveryDocument | null> {
    return this.PasswordRecoveryModel.findOne({
      confirmationCode: recoveryCode,
    });
  }

  async updateHash(
    email: string,
    passwordHash: string,
  ): Promise<boolean | null> {
    const user = await this.UserModel.findOne({ email: email });
    user.passwordHash = passwordHash;

    try {
      user.save();
      return true;
    } catch (e) {
      console.error(e);
      return null;
    }
  }

  async changeRecoveryCodeStatus(id: ObjectId): Promise<boolean | null> {
    const recoveryPasswordObject = await this.PasswordRecoveryModel.findById(
      id,
    );
    recoveryPasswordObject.isUsed = true;

    try {
      recoveryPasswordObject.save();
      return true;
    } catch (e) {
      console.error(e);
      return null;
    }
  }
}

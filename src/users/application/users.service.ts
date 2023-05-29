import { Injectable } from '@nestjs/common';
import { UsersRepository } from '../infrastructure/users.repository';
import { UserInputModel } from '../api/models/input/user.input.model';
import { UserViewModel } from '../api/models/view/user.view.model';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(private usersRepository: UsersRepository) {}

  async createUser(inputUserData: UserInputModel): Promise<UserViewModel> {
    const { login, password, email } = inputUserData;

    const passwordSalt = await bcrypt?.genSalt(10);
    const passwordHash = await this._generateHash(password, passwordSalt);

    const user = {
      login,
      email,
      createdAt: new Date().toISOString(),
      passwordHash,
    };

    const createdUser = await this.usersRepository.insertUser(user);

    return {
      id: createdUser._id.toString(),
      login,
      email,
      createdAt: user.createdAt,
    };
  }

  async deleteUser(userId: string) {
    const deletedUser = await this.usersRepository.deleteUser(userId);

    return deletedUser.deletedCount === 1;
  }

  private async _generateHash(pass: string, salt: string): Promise<string> {
    return await bcrypt.hash(pass, salt);
  }
}

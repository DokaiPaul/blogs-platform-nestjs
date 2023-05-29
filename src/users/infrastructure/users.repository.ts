import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from './users.schema';
import { Model } from 'mongoose';
import { ObjectId } from 'mongodb';

@Injectable()
export class UsersRepository {
  constructor(@InjectModel(User.name) private UserModel: Model<UserDocument>) {}

  async insertUser(newUser: User) {
    const user = await new this.UserModel(newUser);
    return user.save();
  }

  async deleteUser(userId) {
    return this.UserModel.deleteOne({ _id: new ObjectId(userId) });
  }
}

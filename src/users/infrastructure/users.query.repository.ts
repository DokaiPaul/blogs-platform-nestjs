import { Injectable } from '@nestjs/common';
import { QueryUserParamsModel } from '../../blogs/api/models/input/query.params.model';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from './users.schema';
import { Model, SortOrder } from 'mongoose';
import { ObjectId } from 'mongodb';
import { UserViewModel } from '../api/models/view/user.view.model';

@Injectable()
export class UsersQueryRepository {
  constructor(@InjectModel(User.name) private UserModel: Model<UserDocument>) {}

  async getUsers(queryParams?: QueryUserParamsModel) {
    const {
      searchEmailTerm,
      searchLoginTerm,
      sortBy,
      sortDirection,
      pageSize,
      pageNumber,
      banStatus,
    } = this.getQueryParams(queryParams);

    let filter = {};
    const sort = { [sortBy]: sortDirection as SortOrder };

    if (banStatus === 'all') {
      if (searchEmailTerm)
        filter = { email: { $regex: searchEmailTerm, $options: 'i' } };
      if (searchLoginTerm)
        filter = { login: { $regex: searchLoginTerm, $options: 'i' } };
      if (searchEmailTerm && searchLoginTerm)
        filter = {
          $and: [
            { login: { $regex: searchLoginTerm, $options: 'i' } },
            { email: { $regex: searchEmailTerm, $options: 'i' } },
          ],
        };
    }

    if (banStatus === 'banned' || 'notBanned') {
      let status;
      if (banStatus === 'banned') status = true;
      if (banStatus === 'notBanned') status = false;

      if (searchEmailTerm)
        filter = {
          $and: [
            { email: { $regex: searchEmailTerm, $options: 'i' } },
            { 'banInfo.isBanned': status },
          ],
        };
      if (searchLoginTerm)
        filter = {
          $and: [
            { login: { $regex: searchEmailTerm, $options: 'i' } },
            { 'banInfo.isBanned': status },
          ],
        };
      if (searchEmailTerm && searchLoginTerm)
        filter = {
          $and: [
            {
              $and: [
                { login: { $regex: searchLoginTerm, $options: 'i' } },
                { email: { $regex: searchEmailTerm, $options: 'i' } },
              ],
            },
            { 'banInfo.isBanned': status },
          ],
        };
    }

    const users =
      (await this.UserModel.find(filter)
        .sort(sort)
        .limit(pageSize)
        .skip((pageNumber - 1) * pageSize)) ?? [];

    const usersToViewModel = users.map((u) => this.convertToViewUser(u));

    const totalMatchedPosts = await this.UserModel.countDocuments(filter);
    const totalPages = Math.ceil(totalMatchedPosts / pageSize);

    return {
      pagesCount: totalPages,
      page: pageNumber,
      pageSize: pageSize,
      totalCount: totalMatchedPosts,
      items: usersToViewModel,
    };
  }

  async getUserById(userId: string) {
    return this.UserModel.findById(userId);
  }

  private getQueryParams(
    queryParams: QueryUserParamsModel,
  ): QueryUserParamsModel {
    const propertyKeys = ['id', 'login', 'createdAt', 'email'];

    let sortBy = 'createdAt';
    let banStatus = 'all';
    const sortDirection = queryParams.sortDirection ?? 'desc';
    const pageNumber = +queryParams.pageNumber || 1; //if passed param is equal to 0/null or undefined, the default value will be 1
    const pageSize = +queryParams.pageSize || 10; //if passed param is equal to 0/null or undefined, the default value will be 10
    const searchEmailTerm = queryParams.searchEmailTerm ?? null;
    const searchLoginTerm = queryParams.searchLoginTerm ?? null;

    if (queryParams.sortBy && propertyKeys.includes(queryParams.sortBy)) {
      sortBy = queryParams.sortBy;
    }
    if (queryParams.banStatus) {
      if (queryParams.banStatus === 'banned') banStatus = queryParams.banStatus;
      if (queryParams.banStatus === 'notBanned')
        banStatus = queryParams.banStatus;
    }

    return {
      sortBy,
      sortDirection,
      pageNumber,
      pageSize,
      searchEmailTerm,
      searchLoginTerm,
      banStatus,
    };
  }

  private convertToViewUser(user: User & { _id: ObjectId }): UserViewModel {
    return {
      id: user._id.toString(),
      login: user.login,
      email: user.email,
      createdAt: user.createdAt,
      banInfo: {
        isBanned: user.banInfo.isBanned,
        banReason: user.banInfo.banReason,
        banDate: user.banInfo.banDate,
      },
    };
  }

  async getInfoAboutUser(userId: string) {
    const user = await this.UserModel.findById(userId);
    if (!user) return null;

    return {
      login: user.login,
      email: user.email,
      userId,
    };
  }
}

import { Injectable } from '@nestjs/common';
import { BanUserInBlogDto } from '../dto/ban-user-in-blog.dto';
import { UsersQueryRepository } from '../../../users/infrastructure/users.query.repository';
import { InjectModel } from '@nestjs/mongoose';
import {
  BlackListInfo,
  Blog,
  BlogDocument,
} from '../../../blogs/infrastructure/blog.schema';
import { Model } from 'mongoose';

@Injectable()
export class BanUserInBlogUseCaseService {
  constructor(
    private UserQueryRepository: UsersQueryRepository,
    @InjectModel(Blog.name) private BlogModel: Model<BlogDocument>,
  ) {}

  async setUserBanStatusInBlog(
    userId: string,
    bloggerId: string,
    banDetails: BanUserInBlogDto,
  ) {
    const user = await this.getUserById(userId);
    if (!user) return null;
    const blog = await this.BlogModel.findById(banDetails.blogId);
    if (!blog || blog.blogOwnerInfo.userId !== bloggerId) return null;

    if (banDetails.isBanned) {
      const infoAboutUser = {
        id: userId,
        login: user.login,
        banInfo: {
          isBanned: banDetails.isBanned,
          banReason: banDetails.banReason,
          banDate: new Date().toISOString(),
        },
      };

      const isUserBanned = await this.addUserInBlackList(
        banDetails.blogId,
        infoAboutUser,
      );

      return isUserBanned;
    }

    const isUserUnbanned = await this.removeUserFromBlackList(
      banDetails.blogId,
      userId,
    );

    return isUserUnbanned;
  }

  private async getUserById(userId: string) {
    return this.UserQueryRepository.getUserById(userId);
  }

  private async addUserInBlackList(blogId: string, dto: BlackListInfo) {
    const blog = await this.BlogModel.findById(blogId);
    if (!blog) return false;

    blog.blackList.push(dto);

    try {
      blog.save();
      return true;
    } catch (e) {
      console.error(e);
      return false;
    }
  }
  private async removeUserFromBlackList(blogId: string, userId: string) {
    const blog = await this.BlogModel.findById(blogId);
    if (!blog) return false;

    const newList = blog.blackList.filter((u) => u.id !== userId);
    blog.blackList = newList;

    try {
      blog.save();
      return true;
    } catch (e) {
      console.error(e);
      return false;
    }
  }
}

import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from '../../../users/infrastructure/users.schema';
import { Model } from 'mongoose';
import { UsersRepository } from '../../../users/infrastructure/users.repository';

@Injectable()
export class BanUserUseCaseService {
  constructor(
    @InjectModel(User.name) private UserModel: Model<UserDocument>,
    private UserRepository: UsersRepository,
  ) {}

  async setBanStatusByUserId(userId: string) {}

  private async changeCurrentUserBanStatus(userId: string) {}

  private async deleteAllUserActiveSessions(userId: string) {}

  private async changeStatusesOfUserPosts(userId: string) {}

  private async changeStatusesOfUserComments(userId: string) {}

  private async changeStatusesOfUserLikes(userId: string) {}
}

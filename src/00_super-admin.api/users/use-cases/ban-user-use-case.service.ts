import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import {
  BanInfo,
  User,
  UserDocument,
} from '../../../users/infrastructure/users.schema';
import { Model } from 'mongoose';
import { UsersRepository } from '../../../users/infrastructure/users.repository';
import { BanUserInputDto } from '../dto/ban-user-input.dto';
import { ActiveSessionService } from '../../../devices/active.sessions.service';
import { PostsRepository } from '../../../blogs/infrastructure/posts.repository';
import { CommentsRepository } from '../../../blogs/infrastructure/comments.repository';

@Injectable()
export class BanUserUseCaseService {
  constructor(
    @InjectModel(User.name) private UserModel: Model<UserDocument>,
    private UserRepository: UsersRepository,
    private ActiveSessionsService: ActiveSessionService,
    private PostRepository: PostsRepository,
    private CommentRepository: CommentsRepository,
  ) {}

  async changeBanStatusByUserId(userId: string, banUserDto: BanUserInputDto) {
    const banInfo = {
      ...banUserDto,
      banDate: new Date().toISOString(),
    };
    let hideStatus = 'hide';
    if (banUserDto.isBanned === false) hideStatus = 'unhide';

    const isStatusChanged = await this.setCurrentUserBanStatus(userId, banInfo);
    if (!isStatusChanged) return null;

    const isContentStatusChanged = await this.setHideStatusOfAllContent(
      userId,
      hideStatus,
    );
    if (!isContentStatusChanged) return null;

    if (banUserDto.isBanned === true) {
      const isSessionsDeleted = await this.deleteAllUserActiveSessions(userId);
      if (!isSessionsDeleted) return null;
    }

    return true;
  }

  private async setHideStatusOfAllContent(userId: string, hideStatus: string) {
    const isPostsHidden = await this.changeStatusesOfUserPosts(
      userId,
      hideStatus,
    );
    if (!isPostsHidden) return null;

    const isCommentsHidden = await this.changeStatusesOfUserComments(
      userId,
      hideStatus,
    );
    if (!isCommentsHidden) return null;

    const isLikesHidden = await this.changeStatusesOfUserLikes(
      userId,
      hideStatus,
    );
    if (!isLikesHidden) return null;

    return true;
  }

  private async setCurrentUserBanStatus(userId: string, banInfo: BanInfo) {
    const user = await this.UserModel.findById(userId);
    user.banInfo = banInfo;

    return this.UserRepository.save(user);
  }

  private async deleteAllUserActiveSessions(userId: string) {
    const result = await this.ActiveSessionsService.deleteAllDevices(userId);
    return result;
  }

  private async changeStatusesOfUserPosts(userId: string, hideStatus: string) {
    let isHide = true;
    if (hideStatus === 'unhide') isHide = false;

    const isPostsHidden =
      await this.PostRepository.changeHideStatusAllPostsByUserId(
        userId,
        isHide,
      );
    return isPostsHidden;
  }

  private async changeStatusesOfUserComments(
    userId: string,
    hideStatus: string,
  ) {
    let isHide = true;
    if (hideStatus === 'unhide') isHide = false;

    const isCommentsHidden =
      await this.CommentRepository.changeHideStatusAllCommentsByUserId(
        userId,
        isHide,
      );
    return isCommentsHidden;
  }

  private async changeStatusesOfUserLikes(userId: string, hideStatus: string) {
    let isHide = true;
    if (hideStatus === 'unhide') isHide = false;

    const isPostLikesHidden = await this.PostRepository.hideAllLikesByUserId(
      userId,
      isHide,
    );
    if (!isPostLikesHidden) return null;

    const isCommentLikesHidden =
      await this.CommentRepository.hideAllLikesByUserId(userId, isHide);
    if (!isCommentLikesHidden) return null;

    return true;
  }
}

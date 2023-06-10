import { Injectable } from '@nestjs/common';
import { CommentsRepository } from '../infrastructure/comments.repository';
import { CommentLikeStatusDto } from './dto/set.like.status.dto';

@Injectable()
export class CommentsService {
  constructor(private CommentsRepository: CommentsRepository) {}

  async addComment() {
    return;
  }

  async updateComment() {
    return;
  }

  async deleteComment(commentId: string) {
    //todo add extracting of user id to determine if the comment belongs to user
    const result = await this.CommentsRepository.deleteComment(commentId);

    return result.deletedCount === 1;
  }

  async setLikeStatus(statusDTO: CommentLikeStatusDto) {
    const { status, commentId, userId } = statusDTO;
    let currentStatus = 'None';

    const isAlreadyLiked = await this.CommentsRepository.findLikeByUser({
      userId,
      commentId,
    });
    if (isAlreadyLiked) currentStatus = 'Like';

    const isAlreadyDisliked = await this.CommentsRepository.findDislikeByUser({
      userId,
      commentId,
    });
    if (isAlreadyDisliked) currentStatus = 'Dislike';

    if (currentStatus === status) return null;

    if (currentStatus === 'None') {
      const result = await this.addNewLikeStatus(statusDTO);
      return result;
    } else {
      const result = await this.changeCurrentLikeStatus(statusDTO);
      return result;
    }
  }

  async addNewLikeStatus({ status, ...dataAboutStatus }: CommentLikeStatusDto) {
    if (status === 'Like') {
      const result = await this.CommentsRepository.addLike(dataAboutStatus);
      if (!result) return null;
      return true;
    }
    if (status === 'Dislike') {
      const result = await this.CommentsRepository.addDislike(dataAboutStatus);
      if (!result) return null;
      return true;
    }

    return null;
  }

  async changeCurrentLikeStatus({
    status,
    commentId,
    userId,
    login,
  }: CommentLikeStatusDto) {
    const addStatusDto = { userId, commentId, login };
    const removeOrFindStatusDto = { userId, commentId };

    if (status === 'Like') {
      const result = await this.CommentsRepository.addLike(addStatusDto);
      if (!result) return null;

      const isRemoved = await this.CommentsRepository.removeDislike(
        removeOrFindStatusDto,
      );
      if (!isRemoved) return null;

      return true;
    }

    if (status === 'Dislike') {
      const result = await this.CommentsRepository.addDislike(addStatusDto);
      if (!result) return null;

      const isRemoved = await this.CommentsRepository.removeLike(
        removeOrFindStatusDto,
      );
      if (!isRemoved) return null;

      return true;
    }

    if (status === 'None') {
      const isLiked = await this.CommentsRepository.findLikeByUser(
        removeOrFindStatusDto,
      );
      if (isLiked) {
        const result = await this.CommentsRepository.removeLike(
          removeOrFindStatusDto,
        );
        if (!result) return null;

        return true;
      }

      const isDisliked = await this.CommentsRepository.findDislikeByUser(
        removeOrFindStatusDto,
      );
      if (isDisliked) {
        const result = await this.CommentsRepository.removeDislike(
          removeOrFindStatusDto,
        );
        if (!result) return null;

        return true;
      }
    }

    return null;
  }
}

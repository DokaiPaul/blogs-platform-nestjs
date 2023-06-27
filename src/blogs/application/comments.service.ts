import { Injectable } from '@nestjs/common';
import { CommentsRepository } from '../infrastructure/comments.repository';
import { CommentLikeStatusDto } from './dto/set.like.status.dto';
import { CommentsQueryRepository } from '../infrastructure/comments.query.repository';

@Injectable()
export class CommentsService {
  constructor(
    private CommentsRepository: CommentsRepository,
    private CommentsQueryRepository: CommentsQueryRepository,
  ) {}

  async addComment(
    content: string,
    postId: string,
    blogId: string,
    commentatorInfo: {
      userId: string;
      userLogin: string;
    },
  ) {
    const newComment = {
      postId,
      blogId,
      content,
      commentatorInfo,
      createdAt: new Date().toISOString(),
      likes: [],
      dislikes: [],
    };

    const createdComment = await this.CommentsRepository.addComment(newComment);
    if (!createdComment) return null;

    return {
      id: createdComment._id.toString(),
      content,
      createdAt: createdComment.createdAt,
      commentatorInfo,
      likesInfo: {
        likesCount: 0,
        dislikesCount: 0,
        myStatus: 'None',
      },
    };
  }

  async updateComment(updateDto: {
    userId: string;
    commentId: string;
    content: string;
  }) {
    const comment = await this.CommentsQueryRepository.getCommentById(
      updateDto.commentId,
    );
    if (!comment) return 'not found';
    if (comment.commentatorInfo.userId !== updateDto.userId)
      return 'is not owner';

    const isUpdated = await this.CommentsRepository.updateComment(
      updateDto.commentId,
      updateDto.content,
    );
    if (!isUpdated) return null;

    return true;
  }

  async deleteComment(commentId: string, userId: string) {
    const comment = await this.CommentsQueryRepository.getCommentById(
      commentId,
      userId,
    );

    if (!comment) return 'not found';
    if (comment.commentatorInfo.userId !== userId) return 'is not owner';

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

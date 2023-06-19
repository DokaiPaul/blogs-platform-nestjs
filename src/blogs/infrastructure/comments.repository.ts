import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Comment, CommentDocument } from './comments.schema';
import { Model } from 'mongoose';
import { CommentLikeStatusDto } from '../application/dto/set.like.status.dto';

@Injectable()
export class CommentsRepository {
  constructor(
    @InjectModel(Comment.name) private CommentModel: Model<CommentDocument>,
  ) {}

  async addComment(comment: Comment) {
    return this.CommentModel.create(comment);
  }

  async updateComment(commentId: string, content: string) {
    const comment = await this.CommentModel.findById(commentId);
    comment.content = content;

    try {
      comment.save();
      return true;
    } catch (e) {
      console.error(e);
      return false;
    }
  }

  async deleteComment(commentId: string) {
    return this.CommentModel.deleteOne({ _id: commentId });
  }

  async findLikeByUser({ userId, commentId }) {
    return this.CommentModel.findOne({
      _id: new Object(commentId),
      likes: { $elemMatch: { userId: userId } },
    });
  }

  async findDislikeByUser({ userId, commentId }) {
    return this.CommentModel.findOne({
      _id: new Object(commentId),
      dislikes: { $elemMatch: { userId: userId } },
    });
  }

  async addLike({
    commentId,
    userId,
    login,
  }: Omit<CommentLikeStatusDto, 'status'>) {
    const comment = await this.CommentModel.findById(commentId);
    comment.likes.push({
      userId,
      login,
      addedAt: new Date().toISOString(),
      isHidden: false,
    });

    try {
      comment.save();
      return true;
    } catch (e) {
      console.error(e);
      return null;
    }
  }

  async addDislike({
    commentId,
    userId,
    login,
  }: Omit<CommentLikeStatusDto, 'status'>) {
    const comment = await this.CommentModel.findById(commentId);
    comment.dislikes.push({
      userId,
      login,
      addedAt: new Date().toISOString(),
      isHidden: false,
    });

    try {
      comment.save();
      return true;
    } catch (e) {
      console.error(e);
      return null;
    }
  }

  async removeLike({ userId, commentId }) {
    return this.CommentModel.updateOne(
      { _id: commentId },
      { $pull: { likes: { userId: userId } } },
    );
  }

  async removeDislike({ userId, commentId }) {
    return this.CommentModel.updateOne(
      { _id: commentId },
      { $pull: { dislikes: { userId: userId } } },
    );
  }
}

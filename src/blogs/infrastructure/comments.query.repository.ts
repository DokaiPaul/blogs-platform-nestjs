import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Comment, CommentDocument } from './comments.schema';
import { Model } from 'mongoose';
import { CommentViewModel } from '../api/models/view/comment.view.model';
import { LikeStatus } from '../api/models/view/likes.info.view.model';

@Injectable()
export class CommentsQueryRepository {
  constructor(
    @InjectModel(Comment.name) private CommentModel: Model<CommentDocument>,
  ) {}

  async getCommentsInPost(postId: string) {
    return [{}, {}];
  }

  async getCommentById(
    commentId: string,
    userId?: string,
  ): Promise<CommentViewModel | null> {
    const comment = await this.CommentModel.findById(commentId);
    if (!comment) return null;

    let myStatus = 'None' as LikeStatus;

    if (userId) {
      if (comment.likes.find((l) => l.userId === userId))
        myStatus = 'Like' as LikeStatus;
      if (comment.dislikes.find((d) => d.userId === userId))
        myStatus = 'Dislike' as LikeStatus;
    }

    return {
      id: comment._id.toString(),
      content: comment.content,
      createdAt: comment.createdAt,
      commentatorInfo: comment.commentatorInfo,
      likesInfo: {
        likesCount: comment.likes.length,
        dislikesCount: comment.dislikes.length,
        myStatus,
      },
    };
  }
}

import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Comment, CommentDocument } from './comments.schema';
import { Model } from 'mongoose';

@Injectable()
export class CommentsQueryRepository {
  constructor(
    @InjectModel(Comment.name) private CommentModel: Model<CommentDocument>,
  ) {}

  async getCommentsInPost(postId: string) {
    return [{}, {}];
  }

  async getCommentById(commentId: string): Promise<CommentDocument | null> {
    const comment = await this.CommentModel.findById(commentId);
    return comment;
  }
}

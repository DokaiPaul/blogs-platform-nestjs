import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Comment, CommentDocument } from './comments.schema';
import { Model } from 'mongoose';

@Injectable()
export class CommentsQueryRepository {
  constructor(
    @InjectModel(Comment.name) private CommentModel: Model<CommentDocument>,
  ) {}

  getCommentsInPost(postId: string) {
    return [{}, {}];
  }

  async getCommentById(commentId: string) {
    return this.CommentModel.findById(commentId);
  }
}

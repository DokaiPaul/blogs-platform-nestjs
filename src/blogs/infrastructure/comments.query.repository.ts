import { Injectable } from '@nestjs/common';

@Injectable()
export class CommentsQueryRepository {
  getCommentsInPost(postId: string) {
    return [{}, {}];
  }

  getCommentById(commentId: string) {
    return {};
  }
}

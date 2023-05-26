import { Controller, Get, Param } from '@nestjs/common';
import { CommentsQueryRepository } from '../infrastructure/comments.query.repository';

@Controller('comments')
export class CommentsController {
  constructor(private commentsQueryRepository: CommentsQueryRepository) {}

  @Get(':id')
  getCommentById(@Param('id') commentId: string) {
    return this.commentsQueryRepository.getCommentById(commentId);
  }
}

import { Controller, Get, NotFoundException, Param } from '@nestjs/common';
import { CommentsQueryRepository } from '../infrastructure/comments.query.repository';

@Controller('comments')
export class CommentsController {
  constructor(private commentsQueryRepository: CommentsQueryRepository) {}

  @Get(':id')
  async getCommentById(@Param('id') commentId: string) {
    const comment = await this.commentsQueryRepository.getCommentById(
      commentId,
    );
    if (!comment) throw new NotFoundException();

    return comment;
  }
}

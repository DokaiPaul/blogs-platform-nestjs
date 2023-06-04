import {
  Controller,
  Delete,
  ForbiddenException,
  Get,
  HttpCode,
  NotFoundException,
  Param,
  Put,
} from '@nestjs/common';
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

  //todo complete endpoints below
  @Put(':id')
  @HttpCode(204)
  async updateCommentById(@Param('id') commentId: string) {
    let comment;

    if (comment === 'not found') throw new NotFoundException();
    if (comment === 'is not owner') throw new ForbiddenException();

    return;
  }

  @Put(':id/like-status')
  @HttpCode(204)
  async setLikeOnCommentById(@Param('id') commentId: string) {
    let comment;

    if (comment === 'not found') throw new NotFoundException();
    if (comment === 'is not owner') throw new ForbiddenException();

    return;
  }

  @Delete(':id')
  @HttpCode(204)
  async deleteCommentById(@Param('id') commentId: string) {
    let comment;

    if (comment === 'not found') throw new NotFoundException();
    if (comment === 'is not owner') throw new ForbiddenException();

    return;
  }
}

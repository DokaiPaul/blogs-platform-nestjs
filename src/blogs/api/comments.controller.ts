import {
  Body,
  Controller,
  Delete,
  ForbiddenException,
  Get,
  HttpCode,
  InternalServerErrorException,
  NotFoundException,
  Param,
  Put,
} from '@nestjs/common';
import { CommentsQueryRepository } from '../infrastructure/comments.query.repository';
import { SetLikeStatusDto } from '../application/dto/set.like.status.dto';
import { UsersQueryRepository } from '../../users/infrastructure/users.query.repository';
import { CommentsRepository } from '../infrastructure/comments.repository';
import { CommentsService } from '../application/comments.service';

@Controller('comments')
export class CommentsController {
  constructor(
    private CommentsQueryRepository: CommentsQueryRepository,
    private CommentRepository: CommentsRepository,
    private CommentService: CommentsService,
    private UserQueryRepository: UsersQueryRepository,
  ) {}

  @Get(':id')
  async getCommentById(@Param('id') commentId: string) {
    const comment = await this.CommentsQueryRepository.getCommentById(
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
  async setLikeOnCommentById(
    @Param('id') commentId: string,
    @Body() likeStatus: SetLikeStatusDto,
  ) {
    const comment = await this.CommentsQueryRepository.getCommentById(
      commentId,
    );
    const user = await this.UserQueryRepository.getUserById('someUserId');

    if (!comment) throw new NotFoundException();
    if (!user) throw new InternalServerErrorException();
    if (comment.commentatorInfo.userId !== user._id.toString())
      throw new ForbiddenException();
    if (typeof likeStatus !== 'string')
      throw new InternalServerErrorException();

    const LikeDTO = {
      status: likeStatus,
      commentId,
      userId: user._id.toString(),
      login: user.login,
    };

    const changedLikeStatus = await this.CommentService.setLikeStatus(LikeDTO);
    if (!changedLikeStatus) throw new InternalServerErrorException();

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

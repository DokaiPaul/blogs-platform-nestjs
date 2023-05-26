import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { PostsService } from '../application/posts.service';
import { PostsQueryRepository } from '../infrastructure/posts.query.repository';
import { CommentsQueryRepository } from '../infrastructure/comments.query.repository';
import { PostInputModel } from './models/input/post.input.model';

@Controller('posts')
export class PostsController {
  constructor(
    private postsService: PostsService,
    private postsQueryRepository: PostsQueryRepository,
    private commentsQueryRepository: CommentsQueryRepository,
  ) {}

  @Get()
  getPosts() {
    return this.postsQueryRepository.getPosts();
  }

  @Get(':id')
  getPostById(@Param('id') postId: string) {
    return this.postsQueryRepository.getPostById(postId);
  }

  @Get(':id/comments')
  getCommentsInPost(@Param('id') postId: string) {
    return this.commentsQueryRepository.getCommentsInPost(postId);
  }

  @Post()
  createPost(@Body() postInput: PostInputModel) {
    return this.postsService.createPost('blogIdIsHere', postInput);
  }

  @Put(':id')
  updatePostById(@Param('id') postId: string) {
    return this.postsService.updatePostById(postId);
  }

  @Delete(':id')
  deletePostById(@Param('id') postId: string) {
    return this.postsService.deletePostById(postId);
  }
}

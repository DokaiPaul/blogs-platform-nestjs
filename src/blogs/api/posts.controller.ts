import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  NotFoundException,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { PostsService } from '../application/posts.service';
import { PostsQueryRepository } from '../infrastructure/posts.query.repository';
import { CommentsQueryRepository } from '../infrastructure/comments.query.repository';
import { PostInputModel } from './models/input/post.input.model';

@Controller('posts')
export class PostsController {
  constructor(
    private PostsService: PostsService,
    private PostsQueryRepository: PostsQueryRepository,
    private CommentsQueryRepository: CommentsQueryRepository,
  ) {}

  @HttpCode(201)
  @Post()
  async createPost(@Body() postInput: PostInputModel) {
    const post = await this.PostsService.createPost(
      postInput.blogId,
      postInput,
    );
    if (!post) throw new NotFoundException();

    return post;
  }

  @Get()
  async getPosts(@Query() queryParams) {
    return this.PostsQueryRepository.getPosts(queryParams);
  }

  @Get(':id')
  async getPostById(@Param('id') postId: string) {
    const post = await this.PostsQueryRepository.getPostById(postId);
    if (!post) throw new NotFoundException();

    return post;
  }

  @Get(':id/comments')
  async getCommentsInPost(@Param('id') postId: string) {
    return this.CommentsQueryRepository.getCommentsInPost(postId);
  }

  @HttpCode(204)
  @Put(':id')
  async updatePostById(@Param('id') postId: string, @Body() updatedData) {
    const post = await this.PostsService.updatePostById(postId, updatedData);
    if (!post) throw new NotFoundException();

    return post;
  }

  @HttpCode(204)
  @Delete(':id')
  async deletePostById(@Param('id') postId: string) {
    const post = await this.PostsService.deletePostById(postId);
    if (!post) throw new NotFoundException();

    return post;
  }
}

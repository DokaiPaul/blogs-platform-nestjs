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
import { BlogsService } from '../application/blogs.service';
import { BlogsQueryRepository } from '../infrastructure/blogs.query.repository';
import { PostsService } from '../application/posts.service';
import { PostsQueryRepository } from '../infrastructure/posts.query.repository';
import { BlogInputModel } from './models/input/blog.input.model';
import { PostInBlogInputModel } from './models/input/post.input.model';

@Controller('blogs')
export class BlogsController {
  constructor(
    private BlogsService: BlogsService,
    private BlogsQueryRepository: BlogsQueryRepository,
    private PostsService: PostsService,
    private PostsQueryRepository: PostsQueryRepository,
  ) {}

  @Post()
  @HttpCode(201)
  async createBlog(@Body() blogData: BlogInputModel) {
    return this.BlogsService.createBlog(blogData);
  }

  @Get()
  async getBlogs(@Query() queryParams) {
    return this.BlogsQueryRepository.getBlogs(queryParams);
  }

  @Get(':id')
  async getBlogById(@Param('id') blogId: string, @Query() queryParams) {
    const blog = await this.BlogsQueryRepository.getBlogById(blogId);
    if (!blog) throw new NotFoundException();

    return blog;
  }

  @Post(':id/posts')
  @HttpCode(201)
  async createPostInBlog(
    @Param('id') blogId: string,
    @Body() postData: PostInBlogInputModel,
  ) {
    const post = this.PostsService.createPost(blogId, postData);
    if (!post) throw new NotFoundException();

    return post;
  }

  @Get(':id/posts')
  async getPostsInBlog(@Param('id') blogId: string, @Query() queryParams) {
    const posts = await this.PostsQueryRepository.getPosts(queryParams, blogId);
    if (posts.items.length === 0) throw new NotFoundException();

    return posts;
  }

  @Put(':id')
  @HttpCode(204)
  async updateBlogById(
    @Param('id') blogId: string,
    @Body() updatedData: BlogInputModel,
  ) {
    const blog = await this.BlogsService.updateBlogById(blogId, updatedData);
    if (!blog) throw new NotFoundException();

    return;
  }

  @Delete(':id')
  @HttpCode(204)
  async deleteBlogById(@Param('id') blogId: string) {
    const isDeleted = await this.BlogsService.deleteBlogById(blogId);
    if (!isDeleted) throw new NotFoundException();

    return;
  }
}

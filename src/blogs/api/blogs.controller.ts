import {
  Body,
  Controller,
  Delete,
  Get,
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
    private blogsService: BlogsService,
    private blogsQueryRepository: BlogsQueryRepository,
    private postsService: PostsService,
    private postsQueryRepository: PostsQueryRepository,
  ) {}

  @Get()
  getBlogs(@Query() queryParams) {
    return this.blogsQueryRepository.getBlogs(queryParams);
  }

  @Get(':id')
  getBlogById(@Param('id') blogId: string, @Query() queryParams) {
    return this.blogsQueryRepository.getBlogById(blogId, queryParams);
  }

  @Get(':id/posts')
  getPostsInBlog(@Param('id') blogId: string) {
    return this.postsQueryRepository.getPostInBlog(blogId);
  }

  @Post(':id/posts')
  createPostInBlog(
    @Param('id') blogId: string,
    @Body() postData: PostInBlogInputModel,
  ) {
    return this.postsService.createPost(blogId, postData);
  }

  @Post()
  createBlog(@Body() blogData: BlogInputModel) {
    return this.blogsService.createBlog(blogData);
  }

  @Put(':id')
  updateBlogById(@Param('id') blogId: string) {
    return this.blogsService.updateBlogById(blogId);
  }

  @Delete(':id')
  deleteBlogById(@Param('id') blogId: string) {
    return this.blogsService.deleteBlogById(blogId);
  }
}

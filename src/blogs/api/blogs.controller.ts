import {
  Body,
  Controller,
  Delete,
  Get,
  Headers,
  HttpCode,
  NotFoundException,
  Param,
  Post,
  Put,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { BlogsService } from '../application/blogs.service';
import { BlogsQueryRepository } from '../infrastructure/blogs.query.repository';
import { PostsService } from '../application/posts.service';
import { PostsQueryRepository } from '../infrastructure/posts.query.repository';
import { CreateBlogDto } from '../application/dto/create.blog.dto';
import { CreatePostDto } from '../application/dto/create.post.dto';
import { BasicAuthGuard } from '../../auth/guards/basic.guard';
import { JwtService } from '@nestjs/jwt';

@Controller('blogs')
export class BlogsController {
  constructor(
    private BlogsService: BlogsService,
    private BlogsQueryRepository: BlogsQueryRepository,
    private PostsService: PostsService,
    private PostsQueryRepository: PostsQueryRepository,
    private JwtService: JwtService,
  ) {}

  @UseGuards(BasicAuthGuard)
  @Post()
  @HttpCode(201)
  async createBlog(@Body() blogData: CreateBlogDto) {
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

  @UseGuards(BasicAuthGuard)
  @Post(':id/posts')
  @HttpCode(201)
  async createPostInBlog(
    @Param('id') blogId: string,
    @Body() postData: CreatePostDto,
  ) {
    const blog = await this.BlogsQueryRepository.getBlogById(blogId);
    if (!blog) throw new NotFoundException();

    const post = this.PostsService.createPost(blogId, postData);
    if (!post) throw new NotFoundException();

    return post;
  }

  @Get(':id/posts')
  async getPostsInBlog(
    @Param('id') blogId: string,
    @Query() queryParams,
    @Req() req,
    @Headers('Authorization') authHeader,
  ) {
    const refreshToken = req.cookies?.refreshToken;
    const accessToken = authHeader?.split(' ')[1];
    let userId;

    if (accessToken) {
      userId = this.JwtService.decode(accessToken)?.sub ?? null;
    } else if (refreshToken) {
      const parsedToken = await this.JwtService.decode(refreshToken);

      if (typeof parsedToken !== 'string') {
        userId = parsedToken.userId;
      }
    }

    const blog = await this.BlogsQueryRepository.getBlogById(blogId);
    if (!blog) throw new NotFoundException();

    const posts = await this.PostsQueryRepository.getPosts(
      queryParams,
      blogId,
      userId,
    );

    return posts;
  }

  @UseGuards(BasicAuthGuard)
  @Put(':id')
  @HttpCode(204)
  async updateBlogById(
    @Param('id') blogId: string,
    @Body() updatedData: CreateBlogDto,
  ) {
    const blog = await this.BlogsService.updateBlogById(blogId, updatedData);
    if (!blog) throw new NotFoundException();

    return;
  }

  @UseGuards(BasicAuthGuard)
  @Delete(':id')
  @HttpCode(204)
  async deleteBlogById(@Param('id') blogId: string) {
    const isDeleted = await this.BlogsService.deleteBlogById(blogId);
    if (!isDeleted) throw new NotFoundException();

    return;
  }
}

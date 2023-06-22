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
  Post,
  Put,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AccessTokenGuard } from '../../auth/guards/accessToken.guard';
import { BlogsRepository } from '../../blogs/infrastructure/blogs.repository';
import { CreatePostDto } from '../../blogs/application/dto/create.post.dto';
import { BlogsQueryRepository } from '../../blogs/infrastructure/blogs.query.repository';
import { PostsService } from '../../blogs/application/posts.service';
import { CreateBlogDto } from '../../blogs/application/dto/create.blog.dto';
import { QueryBlogParamsModel } from '../../blogs/api/models/input/query.params.model';
import { BloggerBlogsService } from './blogger.blogs.service';
import { BlogsService } from '../../blogs/application/blogs.service';

@Controller('blogger/blogs')
export class BloggerBlogsController {
  constructor(
    private BlogsService: BlogsService,
    private BloggersBlogsService: BloggerBlogsService,
    private BlogRepository: BlogsRepository,
    private BlogsQueryRepository: BlogsQueryRepository,
    private PostsService: PostsService,
  ) {}

  @UseGuards(AccessTokenGuard)
  @Post()
  @HttpCode(201)
  async createNewBlog(@Body() blogData: CreateBlogDto, @Req() req) {
    const userId = req?.user?.userId;

    return this.BlogsService.createBlog(blogData, userId);
  }

  @UseGuards(AccessTokenGuard)
  @Post(':id/posts')
  @HttpCode(201)
  async createNewPostInBlog(
    @Param('id') blogId: string,
    @Body() postData: CreatePostDto,
    @Req() req,
  ) {
    const userId = req.user.userId;
    const isUserOwner = await this.BloggersBlogsService.isBlogBelongsToUser(
      blogId,
      userId,
    );
    if (isUserOwner === 'Not found') throw new NotFoundException();
    if (isUserOwner === 'Not owner') throw new ForbiddenException();

    const post = this.PostsService.createPost(blogId, postData, userId);
    if (!post) throw new NotFoundException();

    return post;
  }

  @UseGuards(AccessTokenGuard)
  @Get()
  async getAllBloggersBlogs(
    @Req() req,
    @Query() queryParams: QueryBlogParamsModel,
  ) {
    const userId = req?.user?.userId;

    return await this.BlogsQueryRepository.getAllBloggersBlogs(
      userId,
      queryParams,
    );
  }

  @UseGuards(AccessTokenGuard)
  @Put(':id')
  @HttpCode(204)
  async updateBlog(
    @Param('id') blogId: string,
    @Body() updatedData: CreateBlogDto,
    @Req() req,
  ) {
    const userId = req?.user?.userId;

    const isUpdated = await this.BloggersBlogsService.updateBlog(
      blogId,
      updatedData,
      userId,
    );
    if (isUpdated === 'Not found') throw new NotFoundException();
    if (isUpdated === 'Not owner') throw new ForbiddenException();

    return;
  }

  @UseGuards(AccessTokenGuard)
  @Put(':id/posts/:postId')
  @HttpCode(204)
  async updatePost(
    @Body() updateDto: CreatePostDto,
    @Param('id') blogId: string,
    @Param('postId') postId: string,
    @Req() req,
  ) {
    const userId = req?.user?.userId;

    const isUserOwner = await this.BloggersBlogsService.isBlogBelongsToUser(
      blogId,
      userId,
    );
    if (isUserOwner === 'Not found') throw new NotFoundException();
    if (isUserOwner === 'Not owner') throw new ForbiddenException();

    const isUpdated = await this.PostsService.updatePostById(postId, {
      ...updateDto,
      blogId,
    });
    if (!isUpdated) throw new InternalServerErrorException();

    return;
  }

  @UseGuards(AccessTokenGuard)
  @Delete(':id')
  @HttpCode(204)
  async deleteBlog(@Param('id') blogId: string, @Req() req) {
    const userId = req?.user?.userId;

    const isDeleted = await this.BloggersBlogsService.deleteBlog(
      blogId,
      userId,
    );
    if (isDeleted === 'Not found') throw new NotFoundException();
    if (isDeleted === 'Not owner') throw new ForbiddenException();

    return;
  }

  @UseGuards(AccessTokenGuard)
  @Delete(':id/posts/:postId')
  @HttpCode(204)
  async deletePost(
    @Param('id') blogId: string,
    @Param('postId') postId: string,
    @Req() req,
  ) {
    const userId = req?.user?.userId;

    const isUserOwner = await this.BloggersBlogsService.isBlogBelongsToUser(
      blogId,
      userId,
    );
    if (isUserOwner === 'Not found') throw new NotFoundException();
    if (isUserOwner === 'Not owner') throw new ForbiddenException();

    const isDeleted = await this.PostsService.deletePostById(postId);
    if (!isDeleted) throw new NotFoundException();

    return;
  }
}

import {
  Body,
  Controller,
  Delete,
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
import { PostsService } from '../application/posts.service';
import { PostsQueryRepository } from '../infrastructure/posts.query.repository';
import { CommentsQueryRepository } from '../infrastructure/comments.query.repository';
import { CreatePostWithBlogIdDto } from '../application/dto/create.post.dto';
import { BasicAuthGuard } from '../../auth/guards/basic.guard';
import { CommentsService } from '../application/comments.service';
import { CreateCommentDto } from '../application/dto/create.comment.dto';
import { JwtService } from '@nestjs/jwt';
import { UsersQueryRepository } from '../../users/infrastructure/users.query.repository';

@Controller('posts')
export class PostsController {
  constructor(
    private PostsService: PostsService,
    private PostsQueryRepository: PostsQueryRepository,
    private CommentsService: CommentsService,
    private CommentsQueryRepository: CommentsQueryRepository,
    private JwtService: JwtService,
    private UserQueryRepository: UsersQueryRepository,
  ) {}

  @UseGuards(BasicAuthGuard)
  @HttpCode(201)
  @Post()
  async createPost(@Body() postInput: CreatePostWithBlogIdDto) {
    const post = await this.PostsService.createPost(
      postInput.blogId,
      postInput,
    );
    if (!post) throw new NotFoundException();

    return post;
  }

  @UseGuards(BasicAuthGuard)
  @HttpCode(201)
  @Post(':id/comments')
  async createCommentInPost(
    @Req() req: any,
    @Body() commentInput: CreateCommentDto,
    @Param() postId: string,
  ) {
    const refreshToken = req.cookies?.refreshToken;
    if (!refreshToken) throw new InternalServerErrorException();

    const parsedToken = await this.JwtService.decode(refreshToken);
    if (typeof parsedToken === 'string')
      throw new InternalServerErrorException();

    const userId = parsedToken.userId;
    const user = await this.UserQueryRepository.getUserById(userId);
    if (!user) throw new InternalServerErrorException();

    const userInfo = { userId, userLogin: user.login };
    const content = commentInput.content;

    const comment = await this.CommentsService.addComment(
      content,
      postId,
      userInfo,
    );

    if (!comment) throw new InternalServerErrorException();

    return comment;
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
  async getCommentsInPost(
    @Param('id') postId: string,
    @Query() queryParams,
    @Req() req,
  ) {
    const post = await this.PostsQueryRepository.getPostById(postId);
    if (!post) throw new NotFoundException();

    let userId;

    const refreshToken = req.cookies?.refreshToken;
    if (refreshToken) {
      const parsedToken = await this.JwtService.decode(refreshToken);
      if (typeof parsedToken !== 'string') {
        userId = parsedToken.userId;
      }
    }

    const comments = await this.CommentsQueryRepository.getCommentsInPost(
      queryParams,
      postId,
      userId,
    );

    return comments;
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

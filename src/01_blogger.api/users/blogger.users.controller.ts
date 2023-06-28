import {
  Body,
  Controller,
  ForbiddenException,
  Get,
  HttpCode,
  NotFoundException,
  Param,
  Put,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { BanUserInBlogDto } from './dto/ban-user-in-blog.dto';
import { BanUserInBlogUseCaseService } from './use-cases/ban-user-in-blog-use-case.service';
import { AccessTokenGuard } from '../../auth/guards/accessToken.guard';
import { BlogsQueryRepository } from '../../blogs/infrastructure/blogs.query.repository';
import { QueryBannedUsersInBlogModel } from '../../blogs/api/models/input/query.params.model';

@Controller('/blogger/users')
export class BloggerUsersController {
  constructor(
    private BanUserInBlogUseCase: BanUserInBlogUseCaseService,
    private BlogsQueryRepository: BlogsQueryRepository,
  ) {}

  @UseGuards(AccessTokenGuard)
  @Get('blog/:id')
  async getBannedUsers(
    @Param('id') blogId: string,
    @Query() queryParams: QueryBannedUsersInBlogModel,
    @Req() req,
  ) {
    const userId = req.user.userId;
    const isBlogOwner = await this.BanUserInBlogUseCase.isBlogOwner(
      blogId,
      userId,
    );
    if (!isBlogOwner) throw new ForbiddenException();

    const users = this.BlogsQueryRepository.getAllBannedUsersInBlog(
      blogId,
      queryParams,
    );

    return users;
  }

  @UseGuards(AccessTokenGuard)
  @Put(':id/ban')
  @HttpCode(204)
  async banUserInBlog(
    @Param('id') userId: string,
    @Body() inputDto: BanUserInBlogDto,
    @Req() req,
  ) {
    const result = await this.BanUserInBlogUseCase.setUserBanStatusInBlog(
      userId,
      req.user.userId,
      inputDto,
    );
    if (!result) throw new NotFoundException();

    return;
  }
}

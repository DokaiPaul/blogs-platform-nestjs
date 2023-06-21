import {
  BadRequestException,
  Controller,
  Get,
  HttpCode,
  InternalServerErrorException,
  Param,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { BasicAuthGuard } from '../../auth/guards/basic.guard';
import { BlogsQueryRepository } from '../../blogs/infrastructure/blogs.query.repository';
import { SaBlogsService } from './sa.blogs.service';

@Controller('sa/blogs')
export class SuperAdminBlogsController {
  constructor(
    private BlogsQueryRepository: BlogsQueryRepository,
    private BlogsService: SaBlogsService,
  ) {}

  @UseGuards(BasicAuthGuard)
  @Get()
  async getBlogs(@Query() queryParams) {
    return this.BlogsQueryRepository.getBlogs('Admin', queryParams);
  }

  @UseGuards(BasicAuthGuard)
  @Put(':blogId/bind-with-user/:userId')
  @HttpCode(204)
  async bindBlogWithUser(
    @Param('blogId') blogId: string,
    @Param('userId') userId: string,
  ) {
    const isBound = await this.BlogsService.bindBlogWithUser(blogId, userId);
    if (isBound === 'Not found')
      throw new BadRequestException({
        message: [{ message: `The blog doesn't exist`, field: 'id' }],
      });

    if (isBound === 'Already bound')
      throw new BadRequestException({
        message: [{ message: `The blog is already bound`, field: 'userId' }],
      });

    if (!isBound) throw new InternalServerErrorException();

    return;
  }
}

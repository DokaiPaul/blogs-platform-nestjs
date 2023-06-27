import {
  BadRequestException,
  Body,
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
import { BanBlogUseCaseService } from './use-cases/ban-blog-use-case.service';
import { BanBlogInputDto } from './dto/ban-blog-input.dto';

@Controller('sa/blogs')
export class SuperAdminBlogsController {
  constructor(
    private BlogsQueryRepository: BlogsQueryRepository,
    private BanBlogUseCaseService: BanBlogUseCaseService,
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

  @UseGuards(BasicAuthGuard)
  @Put(':id/ban')
  @HttpCode(204)
  async banBlogById(
    @Param('id') blogId: string,
    @Body() inputDto: BanBlogInputDto,
  ) {
    const result = await this.BanBlogUseCaseService.changeBanStatusByBlogId(
      blogId,
      inputDto,
    );
    if (!result) throw new InternalServerErrorException();

    return;
  }
}

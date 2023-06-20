import {
  Controller,
  Get,
  HttpCode,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { BasicAuthGuard } from '../../auth/guards/basic.guard';
import { BlogsQueryRepository } from '../../blogs/infrastructure/blogs.query.repository';

@Controller('sa/blogs')
export class SuperAdminBlogsController {
  constructor(private BlogsQueryRepository: BlogsQueryRepository) {}

  @UseGuards(BasicAuthGuard)
  @Get()
  async getBlogs(@Query() queryParams) {
    return this.BlogsQueryRepository.getBlogs('Admin', queryParams);
  }

  @UseGuards(BasicAuthGuard)
  @Put(':blogId/bind-with-user/:userId')
  @HttpCode(204)
  async bindBlogWithUser() {
    return 'updated';
  }
}

import { Controller, Get, HttpCode, Put, UseGuards } from '@nestjs/common';
import { BasicAuthGuard } from '../../auth/guards/basic.guard';

@Controller('sa/blogs')
export class SuperAdminBlogsController {
  @UseGuards(BasicAuthGuard)
  @Get()
  async getBlogs() {
    return 'some data';
  }

  @UseGuards(BasicAuthGuard)
  @Put(':blogId/bind-with-user/:userId')
  @HttpCode(204)
  async bindBlogWithUser() {
    return 'updated';
  }
}

import {
  Body,
  Controller,
  Get,
  HttpCode,
  InternalServerErrorException,
  Param,
  Put,
  UseGuards,
} from '@nestjs/common';
import { BanUserInBlogDto } from './dto/ban-user-in-blog.dto';
import { BanUserInBlogUseCaseService } from './use-cases/ban-user-in-blog-use-case.service';
import { AccessTokenGuard } from '../../auth/guards/accessToken.guard';

@Controller('/blogger/users')
export class BloggerUsersController {
  constructor(private BanUserInBlogUseCase: BanUserInBlogUseCaseService) {}

  @UseGuards(AccessTokenGuard)
  @Get('blog/:id')
  async getBannedUsers(@Param(':id') blogId: string) {}

  @UseGuards(AccessTokenGuard)
  @Put(':id/ban')
  @HttpCode(204)
  async banUserInBlog(
    @Param('id') userId: string,
    @Body() inputDto: BanUserInBlogDto,
  ) {
    const result = await this.BanUserInBlogUseCase.setUserBanStatusInBlog(
      userId,
      inputDto,
    );
    if (!result) throw new InternalServerErrorException();

    return;
  }
}

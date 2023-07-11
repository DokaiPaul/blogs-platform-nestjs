import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  InternalServerErrorException,
  NotFoundException,
  Param,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from '../application/users.service';
import { UsersQueryRepository } from '../infrastructure/users.query.repository';
import { UserViewModel } from './models/view/user.view.model';
import { UserInputModel } from './models/input/user.input.model';
import { QueryUserParamsModel } from '../../blogs/api/models/input/query.params.model';
import { PaginatorViewModel } from '../../blogs/api/models/view/paginator.view.model';
import { BasicAuthGuard } from '../../auth/guards/basic.guard';
import { UsersRepositorySQL } from '../infrastructure/db/sql-db/users.repository';

@Controller('users')
export class UsersController {
  constructor(
    private userService: UsersService,
    private usersQueryRepository: UsersQueryRepository,
    private usersSQL: UsersRepositorySQL,
  ) {}

  @Get('test')
  async testUser() {
    return this.usersSQL.findUser();
  }

  @UseGuards(BasicAuthGuard)
  @HttpCode(201)
  @Post()
  async createUser(
    @Body() newUser: UserInputModel,
  ): Promise<UserViewModel | null> {
    const createdUser = await this.userService.createUser(newUser);

    if (!createdUser) throw new InternalServerErrorException();

    if (createdUser === 'email')
      throw new BadRequestException({
        message: [{ message: 'This email is already taken', field: 'email' }],
      });

    if (createdUser === 'login')
      throw new BadRequestException({
        message: [{ message: 'This login is already taken', field: 'login' }],
      });

    return createdUser;
  }

  @UseGuards(BasicAuthGuard)
  @Get()
  async getUser(
    @Query() queryParams: QueryUserParamsModel,
  ): Promise<PaginatorViewModel<UserViewModel | []>> {
    return await this.usersQueryRepository.getUsers(queryParams);
  }

  @UseGuards(BasicAuthGuard)
  @HttpCode(204)
  @Delete(':id')
  async deleteUser(@Param('id') userId: string) {
    const deletedUser = await this.userService.deleteUser(userId);
    if (!deletedUser) throw new NotFoundException();

    return;
  }
}

import { Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { UsersService } from '../application/users.service';
import { UsersQueryRepository } from '../infrastructure/users.query.repository';

@Controller('users')
export class UsersController {
  constructor(
    private userService: UsersService,
    private usersQueryRepository: UsersQueryRepository,
  ) {}

  @Get()
  getUser() {
    return this.usersQueryRepository.getUsers('term');
  }

  @Post()
  createUser() {
    return this.userService.createUser();
  }

  @Delete(':id')
  deleteUser(@Param('id') userId: string) {
    return this.userService.deleteUser(userId);
  }
}

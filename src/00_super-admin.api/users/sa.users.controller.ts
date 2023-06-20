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
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { BasicAuthGuard } from '../../auth/guards/basic.guard';
import { BanUserInputDto } from './dto/ban-user-input.dto';
import { UserInputModel } from '../../users/api/models/input/user.input.model';
import { UserViewModel } from '../../users/api/models/view/user.view.model';
import { UsersService } from '../../users/application/users.service';
import { QueryUserParamsModel } from '../../blogs/api/models/input/query.params.model';
import { PaginatorViewModel } from '../../blogs/api/models/view/paginator.view.model';
import { UsersQueryRepository } from '../../users/infrastructure/users.query.repository';
import { BanUserUseCaseService } from './use-cases/ban-user-use-case.service';

@Controller('sa/users')
export class SuperAdminUsersController {
  constructor(
    private userService: UsersService,
    private usersQueryRepository: UsersQueryRepository,
    private banUserUseCaseService: BanUserUseCaseService,
  ) {}

  @UseGuards(BasicAuthGuard)
  @Post()
  @HttpCode(201)
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
  async getUsers(
    @Query() queryParams: QueryUserParamsModel,
  ): Promise<PaginatorViewModel<UserViewModel | []>> {
    return await this.usersQueryRepository.getUsers(queryParams);
  }

  //todo complete the endpoint below
  @UseGuards(BasicAuthGuard)
  @Put(':id/ban')
  @HttpCode(204)
  async changeBanStatus(
    @Body() inputDto: BanUserInputDto,
    @Param('id') userId: string,
  ) {
    const result = await this.banUserUseCaseService.changeBanStatusByUserId(
      userId,
      inputDto,
    );
    if (!result) throw new InternalServerErrorException();

    return;
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

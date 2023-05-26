import { Injectable } from '@nestjs/common';
import { UsersRepository } from '../infrastructure/users.repository';

@Injectable()
export class UsersService {
  constructor(private usersRepository: UsersRepository) {}

  createUser() {
    return this.usersRepository.insertUser();
  }

  deleteUser(userId: string) {
    return this.usersRepository.deleteUser(userId);
  }
}

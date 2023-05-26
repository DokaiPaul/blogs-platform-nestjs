import { Injectable } from '@nestjs/common';

@Injectable()
export class UsersRepository {
  insertUser() {
    return true;
  }

  deleteUser(userId) {
    return true;
  }
}

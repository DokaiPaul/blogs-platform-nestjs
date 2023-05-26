import { Injectable } from '@nestjs/common';

@Injectable()
export class UsersQueryRepository {
  getUsers(searchTerm: string) {
    return [{}, {}];
  }
}

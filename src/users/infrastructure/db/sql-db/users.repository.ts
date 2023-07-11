import { Injectable } from '@nestjs/common';
import { User } from '../../users.schema';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';

@Injectable()
export class UsersRepositorySQL {
  constructor(@InjectDataSource() protected dataSource: DataSource) {}

  async createUser(newUser: User) {
    return;
  }

  async findUser() {
    return this.dataSource.query(`
    SELECT * FROM public."users";
    `);
  }
}

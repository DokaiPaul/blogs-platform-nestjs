import { Injectable } from '@nestjs/common';
import { User } from '../../users.schema';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';

@Injectable()
export class UsersRepositorySQL {
  constructor(@InjectDataSource() protected dataSource: DataSource) {}

  async insertUser(newUser: User) {
    const { login, email, passwordHash, createdAt } = newUser;
    const usersParameters = [login, email, passwordHash, createdAt];

    const userId = await this.dataSource.query(
      `
    INSERT INTO public."users"
        (
        "login", 
        "email",
        "hash",
        "createdAt"
        )
    VALUES
        ($1, $2, $3, $4)  
    RETURNING id
    `,
      usersParameters,
    );

    const { confirmationCode, isConfirmed, expirationDate } =
      newUser.emailConfirmation;
    const emailConfirmationParameters = [
      confirmationCode,
      expirationDate,
      isConfirmed,
      userId[0].id,
    ];

    await this.dataSource.query(
      `INSERT INTO public."emailConfirmation"
        (
        "confirmationCode",
        "expirationDate",
        "isConfirmed",
        "userId"
        )
      VALUES
        ($1, $2, $3, $4)
      `,
      emailConfirmationParameters,
    );

    const createdUser = {
      _id: userId[0].id,
      ...newUser,
    };

    return createdUser;
  }

  async findUserByLogin(login: string) {
    const user = await this.dataSource.query(
      `
    SELECT * FROM public."users"
    WHERE "login" = $1;
    `,
      [login],
    );

    return user[0];
  }

  async findUserByEmail(email: string) {
    const user = await this.dataSource.query(
      `
    SELECT * FROM public."users"
    WHERE "email" = $1;
    `,
      [email],
    );

    return user[0];
  }

  async findUserByEmailOrLogin(searchTerm: string) {
    const foundByEmail = await this.dataSource.query(
      `
            SELECT * FROM public."users"
            WHERE "email" = $1 OR "login" = $1
            `,
      [searchTerm],
    );

    return foundByEmail;
  }

  async deleteUser(userId: string) {
    await this.dataSource.query(
      `
    DELETE FROM public."emailConfirmation"
    WHERE "userId" = $1
      `,
      [userId],
    );

    await this.dataSource.query(
      `
    DELETE FROM public."bannedUsers"
    WHERE "userId" = $1
      `,
      [userId],
    );

    await this.dataSource.query(
      `
    DELETE FROM public."passwordRecoveries"
    WHERE "userId" = $1
      `,
      [userId],
    );

    await this.dataSource.query(
      `
    DELETE FROM public."activeSessions"
    WHERE "userId" = $1
      `,
      [userId],
    );

    await this.dataSource.query(
      `
    DELETE FROM public."users"
    WHERE "id" = $1
    `,
      [userId],
    );

    return true;
  }
}

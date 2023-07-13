import { Injectable } from '@nestjs/common';
import { User } from '../../users.schema';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { ObjectId } from 'mongodb';
import { PasswordRecovery } from '../../password.recovery.schema';

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

    return foundByEmail[0];
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

  async findUserByConfirmationCode(code: string) {
    const user = await this.dataSource.query(
      `
    SELECT * FROM public."emailConfirmation" ec
    FULL OUTER JOIN public."users" u
    ON ec."userId" = u."id"
    WHERE ec."confirmationCode" = $1
    `,
      [code],
    );

    return user[0];
  }

  async updateConfirmationStatus(userId: ObjectId) {
    try {
      await this.dataSource.query(
        `
    UPDATE public."emailConfirmation"
    SET "confirmationStatus" = true
    WHERE "userId" = $1
    `,
        [userId],
      );

      return true;
    } catch (e) {
      console.error(e);
      return false;
    }
  }
  async updateConfirmationCode(userId: string, confirmationCode: string) {
    try {
      await this.dataSource.query(
        `
    UPDATE public."emailConfirmation"
    SET "confirmationCode" = $1
    WHERE "userId" = $2
    `,
        [confirmationCode, userId],
      );
      return true;
    } catch (e) {
      console.error(e);
      return false;
    }
  }

  async addRecoveryConfirmationCode(recoveryCodeObject: PasswordRecovery) {
    try {
      const { confirmationCode, email, isUsed, creationDate } =
        recoveryCodeObject;
      const parameters = [confirmationCode, creationDate, email, isUsed];

      await this.dataSource.query(
        `
    INSERT INTO public."passwordRecoveries"
      (
      "confirmationCode",
      "creationDate",
      "email",
      "isUsed"
      )
    VALUES
        (
        $1, $2, $3, $4
        )
    `,
        parameters,
      );

      return true;
    } catch (e) {
      console.error(e);
      return false;
    }
  }

  async findRecoveryConfirmationCode(recoveryCode: string) {
    const passwordRecovery = await this.dataSource.query(
      `
    SELECT *, "id" as _id FROM public."passwordRecoveries"
    WHERE "recoveryCode" = $1
    `,
      [recoveryCode],
    );

    return passwordRecovery[0];
  }

  async changeRecoveryCodeStatus(id: string) {
    try {
      await this.dataSource.query(
        `
    UPDATE public."passwordRecoveries"
    SET "isUsed" = true
    WHERE "id" = $1
    `,
        [id],
      );

      return true;
    } catch (e) {
      console.error(e);
      return false;
    }
  }

  async updateHash(email: string, passwordHash: string) {
    try {
      await this.dataSource.query(
        `
    UPDATE public."users"
    SET "hash" = $1
    WHERE "email" = $2
    `,
        [passwordHash, email],
      );

      return true;
    } catch (e) {
      console.error(e);
      return false;
    }
  }
}

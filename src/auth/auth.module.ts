import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { LocalStrategy } from './strategies/local.strategy';
import { UsersService } from '../users/application/users.service';
import { UsersRepository } from '../users/infrastructure/users.repository';
import { ActiveSessionService } from '../devices/active.sessions.service';
import { EmailsManager } from '../managers/email.sender.manager';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from '../users/infrastructure/users.schema';
import {
  PasswordRecovery,
  PasswordRecoverySchema,
} from '../users/infrastructure/password.recovery.schema';
import { ActiveSessionRepository } from '../devices/active.sessions.repository';
import {
  ActiveSession,
  ActiveSessionSchema,
} from '../devices/active.sessions.model';
import { EmailAdapter } from '../adapters/email.adapter';
import { AccessTokenStrategy } from './strategies/accessToken.strategy';
import { RefreshTokenStrategy } from './strategies/refreshToken.strategy';
import { BasicStrategy } from './strategies/basic.strategy';

@Module({
  imports: [
    PassportModule,
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    MongooseModule.forFeature([
      { name: PasswordRecovery.name, schema: PasswordRecoverySchema },
    ]),
    MongooseModule.forFeature([
      { name: ActiveSession.name, schema: ActiveSessionSchema },
    ]),
    JwtModule.register({}),
  ],
  providers: [
    AuthService,
    BasicStrategy,
    LocalStrategy,
    AccessTokenStrategy,
    RefreshTokenStrategy,
    UsersService,
    UsersRepository,
    ActiveSessionService,
    ActiveSessionRepository,
    EmailsManager,
    EmailAdapter,
  ],
  exports: [AuthService],
})
export class AuthModule {}

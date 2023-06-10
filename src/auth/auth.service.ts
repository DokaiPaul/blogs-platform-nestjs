import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/application/users.service';
import { JwtService } from '@nestjs/jwt';
import { UsersRepository } from '../users/infrastructure/users.repository';
import * as bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';
import { ActiveSessionService } from '../devices/active.sessions.service';

@Injectable()
export class AuthService {
  constructor(
    private UserService: UsersService,
    private JwtService: JwtService,
    private UserRepository: UsersRepository,
    private ActiveSessionService: ActiveSessionService,
  ) {}

  async validateUser(loginOrEmail: string, password: string) {
    const user = await this.UserRepository.findUserByLoginOrEmail(loginOrEmail);

    if (!user) return null;

    const result = await bcrypt.compare(password, user.passwordHash);

    if (!result) return null;

    return user._id.toString();
  }

  async login(userId: string, ip: string, title: string) {
    const sessionInfo = {
      deviceId: uuidv4(),
      userId,
      ip,
      title,
      lastActivateDate: new Date().toISOString(),
      tokenExpirationDate: 'some date',
    };

    const result = await this.ActiveSessionService.addDevice(sessionInfo);
    if (!result) return null;

    return result;
  }

  async logout(sessionId: string) {}

  async killAllSessions(sessionId: string) {}
}

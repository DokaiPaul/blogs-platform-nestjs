import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/application/users.service';
import { JwtService } from '@nestjs/jwt';
import { UsersRepository } from '../users/infrastructure/users.repository';
import * as bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';
import { ActiveSessionService } from '../devices/active.sessions.service';
import { JwtPayload } from 'jsonwebtoken';
import { jwtConstants } from './constants';
import { ActiveSessionRepository } from '../devices/active.sessions.repository';

@Injectable()
export class AuthService {
  constructor(
    private UserService: UsersService,
    private JwtService: JwtService,
    private UserRepository: UsersRepository,
    private ActiveSessionService: ActiveSessionService,
    private ActiveSessionRepository: ActiveSessionRepository,
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
      tokenExpirationDate: '',
      lastActivateDate: '',
    };

    const { accessToken, refreshToken } = await this.generateTokens(
      userId,
      sessionInfo.deviceId,
    );

    const parsedRToken = (await this.JwtService.decode(
      refreshToken,
    )) as JwtPayload;
    if (!parsedRToken.exp || !parsedRToken.iat) return null;

    sessionInfo.tokenExpirationDate = new Date(
      new Date(0).setUTCSeconds(parsedRToken.exp),
    ).toISOString();
    sessionInfo.lastActivateDate = new Date(
      new Date(0).setUTCSeconds(parsedRToken.iat),
    ).toISOString();

    const result = await this.ActiveSessionService.addDevice(sessionInfo);
    if (!result) return null;

    return { accessToken, refreshToken, result };
  }

  updateRefreshToken(refreshToken: string) {
    const jwtPayload = this.JwtService.decode(refreshToken);
    if (!jwtPayload || typeof jwtPayload === 'string') return null;

    const isUpdated = this.ActiveSessionService.updateRefreshToken(jwtPayload);
    if (!isUpdated) return null;

    return isUpdated;
  }

  async logout(deviceId: string, userId: string) {
    return this.ActiveSessionRepository.deleteDeviceById(deviceId, userId);
  }

  async killAllSessions(sessionId: string) {
    return;
  }

  async generateTokens(userId: string, deviceId: string) {
    const accessToken = this.JwtService.sign(
      {
        sub: userId,
      },
      {
        secret: jwtConstants.ACCESS_SECRET,
        expiresIn: jwtConstants.ACCESS_TIME_EXPIRATION,
      },
    );

    const refreshToken = this.JwtService.sign(
      {
        deviceId,
        userId,
      },
      {
        secret: jwtConstants.REFRESH_SECRET,
        expiresIn: jwtConstants.REFRESH_TIME_EXPIRATION,
      },
    );

    return { accessToken, refreshToken };
  }
}

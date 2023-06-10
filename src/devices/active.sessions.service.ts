import { Injectable } from '@nestjs/common';
import { ActiveSessionModel } from './dto/active.session.model';
import { ActiveSessionRepository } from './active.sessions.repository';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from 'jsonwebtoken';

@Injectable()
export class ActiveSessionService {
  constructor(
    private ActiveSessionRepository: ActiveSessionRepository,
    private JwtService: JwtService,
  ) {}

  async addDevice(sessionInfo: ActiveSessionModel): Promise<{
    accessToken: string;
    refreshToken: string;
    result: any;
  } | null> {
    const accessToken = this.JwtService.sign(
      {
        sub: sessionInfo.userId,
      },
      { secret: '123', expiresIn: '300s' },
    );

    const refreshToken = this.JwtService.sign(
      {
        deviceId: sessionInfo.deviceId,
        userId: sessionInfo.userId,
      },
      { secret: '123', expiresIn: '10d' },
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

    const result = await this.ActiveSessionRepository.addDevice(sessionInfo);

    return { accessToken, refreshToken, result };
  }
}

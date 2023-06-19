import { Injectable } from '@nestjs/common';
import { ActiveSessionModel } from './dto/active.session.model';
import { ActiveSessionRepository } from './active.sessions.repository';
import { JwtPayload } from 'jsonwebtoken';

@Injectable()
export class ActiveSessionService {
  constructor(private ActiveSessionRepository: ActiveSessionRepository) {}

  async addDevice(sessionInfo: ActiveSessionModel): Promise<any> {
    const result = await this.ActiveSessionRepository.addDevice(sessionInfo);

    return result;
  }

  async updateRefreshToken(refreshToken: JwtPayload) {
    const currentRJWT = await this.ActiveSessionRepository.findDeviceById(
      refreshToken.deviceId,
    );
    if (!currentRJWT) return null;

    const newLastActiveDate = new Date(
      new Date(0).setUTCSeconds(refreshToken.iat),
    ).toISOString();
    const newTokenExpirationDate = new Date(
      new Date(0).setUTCSeconds(refreshToken.exp),
    ).toISOString();

    currentRJWT.lastActivateDate = newLastActiveDate;
    currentRJWT.tokenExpirationDate = newTokenExpirationDate;

    return this.ActiveSessionRepository.save(currentRJWT);
  }

  async deleteAllDevices(userId: string) {
    const result = await this.ActiveSessionRepository.deleteAllDevices(userId);

    return result;
  }
}

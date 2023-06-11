import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { jwtConstants } from '../constants';
import { ActiveSessionRepository } from '../../devices/active.sessions.repository';

@Injectable()
export class RefreshTokenStrategy extends PassportStrategy(
  Strategy,
  'jwt-refresh',
) {
  constructor(private ActiveSessionRepository: ActiveSessionRepository) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        RefreshTokenStrategy.extractRJWTFromCookies,
      ]),
      ignoreExpiration: false,
      secretOrKey: jwtConstants.REFRESH_SECRET,
    });
  }

  private static extractRJWTFromCookies(req: any) {
    if (req.cookies?.refreshToken) {
      return req.cookies.refreshToken;
    }
    return null;
  }

  async validate(payload: any) {
    const session = await this.ActiveSessionRepository.findDeviceById(
      payload.deviceId,
    );

    if (!session) throw new UnauthorizedException();
    const issuedDate = new Date(
      new Date(0).setUTCSeconds(payload.iat),
    ).toISOString();

    if (issuedDate !== session.lastActivateDate.toString())
      throw new UnauthorizedException();

    return { userId: payload.userId, deviceId: payload.deviceId };
  }
}

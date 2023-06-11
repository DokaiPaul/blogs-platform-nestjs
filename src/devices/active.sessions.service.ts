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

  async addDevice(sessionInfo: ActiveSessionModel): Promise<any> {
    const result = await this.ActiveSessionRepository.addDevice(sessionInfo);

    return result;
  }
}

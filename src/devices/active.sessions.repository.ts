import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ActiveSessionModel } from './dto/active.session.model';
import { ActiveSession, ActiveSessionDocument } from './active.sessions.model';
import { Model } from 'mongoose';

@Injectable()
export class ActiveSessionRepository {
  constructor(
    @InjectModel(ActiveSession.name)
    private ActiveSessionModel: Model<ActiveSessionDocument>,
  ) {}
  async addDevice(newDevice: ActiveSessionModel) {
    return this.ActiveSessionModel.create(newDevice);
  }
}

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

  async findDeviceById(deviceId: string) {
    return this.ActiveSessionModel.findOne({ deviceId: deviceId });
  }

  async save(currentRJWT: ActiveSessionDocument) {
    try {
      await currentRJWT.save();
      return true;
    } catch (e) {
      console.error(e);
      return false;
    }
  }

  async deleteDeviceById(deviceId: string) {
    const result = await this.ActiveSessionModel.deleteOne({
      deviceId: deviceId,
    });

    return result.deletedCount === 1;
  }
}

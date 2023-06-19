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

  async deleteDeviceById(deviceId: string, userId: string) {
    const isDeviceExist = await this.ActiveSessionModel.findOne({
      deviceId: deviceId,
    });
    if (!isDeviceExist) return 'not found';

    if (isDeviceExist.userId !== userId) return 'is not owner';

    const result = await this.ActiveSessionModel.deleteOne({
      deviceId: deviceId,
    });

    return result.deletedCount === 1;
  }

  async findDevicesByUserId(userId: string) {
    const sessions = await this.ActiveSessionModel.find({ userId: userId });
    if (!sessions) return [];

    return sessions.map((s) => {
      return {
        ip: s.ip,
        title: s.title,
        lastActiveDate: s.lastActivateDate,
        deviceId: s.deviceId,
      };
    });
  }

  async deleteAllOtherDevices(deviceId: string, userId: string) {
    const result = await this.ActiveSessionModel.deleteMany({
      userId: userId,
      deviceId: { $ne: deviceId },
    });

    return result.acknowledged;
  }

  async deleteAllDevices(userId: string) {
    const result = await this.ActiveSessionModel.deleteMany({ userId: userId });

    return result.acknowledged;
  }
}

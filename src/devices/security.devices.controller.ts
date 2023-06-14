import {
  Controller,
  Delete,
  ForbiddenException,
  Get,
  HttpCode,
  NotFoundException,
  Param,
  Req,
  UseGuards,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { RefreshTokenGuard } from '../auth/guards/refreshToken.guard';
import { ActiveSessionRepository } from './active.sessions.repository';

@Controller('security/devices')
export class SecurityDevicesController {
  constructor(private sessionRepository: ActiveSessionRepository) {}

  @UseGuards(RefreshTokenGuard)
  @Get()
  async getDevicesForActiveSession(@Req() req) {
    const refreshToken = req.user;
    const userId = refreshToken.userId;

    const deviceData = await this.sessionRepository.findDevicesByUserId(userId);

    return deviceData;
  }

  @UseGuards(RefreshTokenGuard)
  @Delete()
  @HttpCode(204)
  async deleteAllDevices(@Req() req) {
    const refreshToken = req.user;
    const userId = refreshToken.userId;
    const deviceId = refreshToken.deviceId;

    await this.sessionRepository.deleteAllOtherDevices(deviceId, userId);

    return;
  }

  @UseGuards(RefreshTokenGuard)
  @Delete(':id')
  @HttpCode(204)
  async deleteDeviceById(@Param('id') deviceId, @Req() req) {
    const refreshToken = req.user;
    const userId = refreshToken.userId;
    const device = await this.sessionRepository.deleteDeviceById(
      deviceId,
      userId,
    );

    if (device === 'not found') throw new NotFoundException();
    if (device === 'is not owner') throw new ForbiddenException();

    return;
  }
}

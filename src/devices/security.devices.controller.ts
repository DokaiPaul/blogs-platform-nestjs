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
import { RefreshTokenGuard } from '../auth/guards/refreshToken.guard';
import { ActiveSessionRepository } from './active.sessions.repository';

@Controller('security')
export class SecurityDevicesController {
  constructor(private sessionRepository: ActiveSessionRepository) {}

  @UseGuards(RefreshTokenGuard)
  @Get('devices')
  async getDevicesForActiveSession(@Req() req) {
    const refreshTokenPayload = req.user;
    const userId = refreshTokenPayload.userId;

    const deviceData = await this.sessionRepository.findDevicesByUserId(userId);

    return deviceData;
  }

  @UseGuards(RefreshTokenGuard)
  @Delete('devices')
  @HttpCode(204)
  async deleteAllDevices(@Req() req) {
    const refreshToken = req.user;
    const userId = refreshToken.userId;
    const deviceId = refreshToken.deviceId;

    await this.sessionRepository.deleteAllOtherDevices(deviceId, userId);

    return;
  }

  @UseGuards(RefreshTokenGuard)
  @Delete('devices/:id')
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

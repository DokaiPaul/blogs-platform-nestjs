import {
  Controller,
  Delete,
  ForbiddenException,
  Get,
  HttpCode,
  NotFoundException,
  Param,
} from '@nestjs/common';

@Controller('security/devices')
export class SecurityDevicesController {
  //todo complete all methods belows
  @Get()
  async getDevicesForActiveSession() {
    return [
      {
        ip: 'string',
        title: 'string',
        lastActiveDate: 'string',
        deviceId: 'string',
      },
    ];
  }

  @Delete()
  @HttpCode(204)
  async deleteAllDevices() {}

  @Delete(':id')
  @HttpCode(204)
  async deleteDeviceById(@Param('id') deviceId) {
    let device;

    if (device === 'not found') throw new NotFoundException();
    if (device === 'is not owner') throw new ForbiddenException();

    return;
  }
}

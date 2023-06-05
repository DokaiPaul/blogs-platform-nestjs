import { Body, Controller, Get, HttpCode, Post } from '@nestjs/common';

@Controller('auth')
export class AuthController {
  //todo complete all endpoints below
  @Post('registration')
  @HttpCode(204)
  async registerNewUser(@Body() userData) {
    return;
  }

  @Post('registration-confirmation')
  @HttpCode(204)
  async confirmRegistration(@Body('code') confirmationCode) {
    return;
  }

  @Post('registration-email-resending')
  @HttpCode(204)
  async registrationResending(@Body('email') email) {
    return;
  }

  @Post('login')
  async login(@Body() credentials) {
    return;
  }

  @Post('logout')
  @HttpCode(204)
  async logout() {
    return;
  }

  @Post('refresh-token')
  async refreshToken(@Body('accessToken') jwt) {
    return;
  }

  @Post('password-recovery')
  @HttpCode(204)
  async passwordRecovery(@Body('email') email) {
    return;
  }

  @Post('new-password')
  @HttpCode(204)
  async setNewPassword(@Body() newPassAndCode) {
    return;
  }

  @Get('me')
  async getInfoAboutMe() {
    return {
      email: 'string',
      login: 'string',
      userId: 'string',
    };
  }
}

import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Headers,
  HttpCode,
  InternalServerErrorException,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { UserInputModel } from '../users/api/models/input/user.input.model';
import { UsersService } from '../users/application/users.service';
import {
  NewPasswordRecoveryInputModel,
  PasswordRecoveryInputModel,
} from '../users/application/dto/password.recovery.input.model';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { AccessTokenGuard } from './guards/accessToken.guard';
import { RefreshTokenGuard } from './guards/refreshToken.guard';
import { UsersQueryRepository } from '../users/infrastructure/users.query.repository';

@Controller('auth')
export class AuthController {
  constructor(
    private UserService: UsersService,
    private AuthService: AuthService,
    private UserQueryRepository: UsersQueryRepository,
  ) {}

  @Post('registration')
  @HttpCode(204)
  async registerNewUser(@Body() userData: UserInputModel) {
    const user = await this.UserService.createUser(userData);

    if (!user) throw new InternalServerErrorException();
    if (user === 'email')
      throw new BadRequestException({
        message: [{ message: 'This email is already taken', field: 'email' }],
      });

    if (user === 'login')
      throw new BadRequestException({
        message: [{ message: 'This login is already taken', field: 'login' }],
      });

    return;
  }

  @Post('registration-confirmation')
  @HttpCode(204)
  async confirmRegistration(@Body('code') confirmationCode: string) {
    const isConfirmed = await this.UserService.confirmEmail(confirmationCode);
    if (!isConfirmed)
      throw new BadRequestException({
        message: [
          { message: 'Some issue with your confirmation code', field: 'code' },
        ],
      });

    return;
  }

  @Post('registration-email-resending')
  @HttpCode(204)
  async registrationResending(@Body('email') email) {
    const isResent = await this.UserService.resendConfirmationCode(email);
    if (!isResent)
      throw new BadRequestException({
        message: [{ message: 'Some issue with your email', field: 'email' }],
      });

    return;
  }

  @HttpCode(200)
  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Body() credentials, @Res() res, @Req() req, @Headers() headers) {
    const ip = headers['x-forwarded-for'] || req.socket.remoteAddress;
    const title = headers['user-agent'] ?? 'unknown';

    if (!req.user || !ip) throw new InternalServerErrorException();

    const result = await this.AuthService.login(req.user, ip, title);
    if (!result) throw new InternalServerErrorException();

    res
      .cookie('refreshToken', result.refreshToken, {
        httpOnly: true,
        secure: true,
      })
      .json({ accessToken: result.accessToken });
    return;
  }

  @UseGuards(RefreshTokenGuard)
  @Post('logout')
  @HttpCode(204)
  async logout(@Req() req) {
    await this.AuthService.logout(req.user.deviceId, req.user.userId);

    return;
  }

  @UseGuards(RefreshTokenGuard)
  @Post('refresh-token')
  async refreshToken(@Req() req, @Res() res) {
    const userId = req.user.userId;
    const deviceId = req.user.deviceId;
    const newTokens = await this.AuthService.generateTokens(userId, deviceId);
    if (!newTokens) throw new InternalServerErrorException();

    const isUpdated = this.AuthService.updateRefreshToken(
      newTokens.refreshToken,
    );
    if (!isUpdated) throw new InternalServerErrorException();

    res
      .cookie('refreshToken', newTokens.refreshToken, {
        httpOnly: true,
        secure: true,
      })
      .json({ accessToken: newTokens.accessToken });

    return;
  }

  @Post('password-recovery')
  @HttpCode(204)
  async passwordRecovery(@Body('email') email: PasswordRecoveryInputModel) {
    await this.UserService.sendEmailToResetPassword(email);

    return;
  }

  @Post('new-password')
  @HttpCode(204)
  async setNewPassword(@Body() newPassAndCode: NewPasswordRecoveryInputModel) {
    const isPassChanged = await this.UserService.setNewPassword(newPassAndCode);

    if (!isPassChanged)
      throw new BadRequestException({
        message: [{ message: 'Code is incorrect', field: 'recoveryCode' }],
      });

    return;
  }

  @UseGuards(AccessTokenGuard)
  @Get('me')
  async getInfoAboutMe(@Req() req: any) {
    const infoAboutUser = await this.UserQueryRepository.getInfoAboutUser(
      req.user.userId,
    );
    if (!infoAboutUser) throw new InternalServerErrorException();

    return infoAboutUser;
  }
}

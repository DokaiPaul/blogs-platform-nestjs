import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { AuthService } from '../auth.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly AuthService: AuthService) {
    super({
      usernameField: 'loginOrEmail',
    });
  }

  async validate(loginOrEmail: string, password: string): Promise<any> {
    if (typeof loginOrEmail !== 'string' || typeof password !== 'string') {
      const errors = { message: [] };

      if (typeof loginOrEmail !== 'string')
        errors.message.push({
          message: 'Email should be a string',
          field: 'email',
        });
      if (typeof password !== 'string')
        errors.message.push({
          message: 'Password should be a string',
          field: 'password',
        });

      throw new BadRequestException(errors);
    }

    const userId = await this.AuthService.validateUser(loginOrEmail, password);
    if (!userId) {
      throw new UnauthorizedException();
    }

    return userId;
  }
}

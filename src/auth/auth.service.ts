import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/application/users.service';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private UserService: UsersService,
    private JwtService: JwtService,
  ) {}

  async validateUser() {
    return null;
  }

  async login() {
    return null;
  }
}

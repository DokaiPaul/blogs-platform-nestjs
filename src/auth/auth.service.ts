import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/application/users.service';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private UserService: UsersService,
    private JwtService: JwtService,
  ) {}

  async registerUser() {
    return null;
  }

  async confirmRegistration() {
    return null;
  }

  async resendEmailConfirmation() {
    return null;
  }

  async validateUser() {
    return null;
  }

  async login() {
    return null;
  }

  async logout() {
    return null;
  }

  async resetPassword() {
    return null;
  }

  async setNewPassword() {
    return null;
  }
}

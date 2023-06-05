import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { AuthService } from './auth.service';

@Module({
  imports: [
    PassportModule,
    JwtModule.register({
      secret: '123',
      signOptions: { expiresIn: '300s' },
    }),
  ],
  providers: [],
  exports: [AuthService],
})
export class AuthModule {}

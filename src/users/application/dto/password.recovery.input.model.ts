import { IsEmail, IsString, Length } from 'class-validator';
import { Transform } from 'class-transformer';
import { trimFn } from '../../../utilities/transform.pipes';

export class PasswordRecoveryInputModel {
  @IsEmail()
  email: string;
}

export class NewPasswordRecoveryInputModel {
  @IsString()
  @Transform(trimFn)
  @Length(6, 20)
  newPassword: string;

  @IsString()
  recoveryCode: string;
}

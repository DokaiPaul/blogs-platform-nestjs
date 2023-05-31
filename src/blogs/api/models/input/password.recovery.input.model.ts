import { IsEmail, IsString, Length } from 'class-validator';

export class PasswordRecoveryInputModel {
  @IsEmail()
  email: string;
}

export class NewPasswordRecoveryInputModel {
  @IsString()
  @Length(6, 20)
  newPassword: string;

  @IsString()
  recoveryCode: string;
}

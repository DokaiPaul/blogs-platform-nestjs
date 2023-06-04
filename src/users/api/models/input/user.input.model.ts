import { IsEmail, IsString, Length, Matches } from 'class-validator';
import { Transform } from 'class-transformer';
import { trimFn } from '../../../../utilities/transform.pipes';

export class UserInputModel {
  @IsString()
  @Transform(trimFn)
  @Length(3, 10)
  @Matches('^[a-zA-Z0-9_-]*$')
  login: string;

  @IsString()
  @Transform(trimFn)
  @Length(6, 20)
  password: string;

  @IsEmail()
  email: string;
}

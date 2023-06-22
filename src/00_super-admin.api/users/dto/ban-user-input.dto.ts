import { IsBoolean, IsString, Length } from 'class-validator';
import { Transform } from 'class-transformer';
import { trimFn } from '../../../utilities/transform.pipes';

export class BanUserInputDto {
  @IsBoolean()
  isBanned: boolean;

  @IsString()
  @Transform(trimFn)
  @Length(20, 1000)
  banReason: string;
}

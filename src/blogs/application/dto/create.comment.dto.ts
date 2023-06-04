import { IsString, Length } from 'class-validator';
import { Transform } from 'class-transformer';
import { trimFn } from '../../../utilities/transform.pipes';

export class CreateCommentDto {
  @IsString()
  @Transform(trimFn)
  @Length(20, 300)
  content: string;
}

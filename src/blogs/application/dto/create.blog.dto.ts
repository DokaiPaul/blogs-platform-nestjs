import { IsString, Length, Matches } from 'class-validator';
import { Transform } from 'class-transformer';
import { trimFn } from '../../../utilities/transform.pipes';

export class CreateBlogDto {
  @IsString()
  @Transform(trimFn)
  @Length(1, 15)
  name: string;

  @IsString()
  @Transform(trimFn)
  @Length(1, 500)
  description: string;

  @IsString()
  @Transform(trimFn)
  @Length(1, 100)
  @Matches('^https://([a-zA-Z0-9_-]+.)+[a-zA-Z0-9_-]+(/[a-zA-Z0-9_-]+)*/?$')
  websiteUrl: string;
}

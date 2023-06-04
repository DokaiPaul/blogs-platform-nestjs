import { IsString, Length } from 'class-validator';
import { Transform } from 'class-transformer';
import { trimFn } from '../../../utilities/transform.pipes';

export class CreatePostDto {
  @IsString()
  @Transform(trimFn)
  @Length(1, 30)
  title: string;

  @IsString()
  @Transform(trimFn)
  @Length(1, 100)
  shortDescription: string;

  @IsString()
  @Transform(trimFn)
  @Length(1, 1000)
  content: string;
}

export class CreatePostWithBlogIdDto extends CreatePostDto {
  @IsString()
  blogId: string;
}

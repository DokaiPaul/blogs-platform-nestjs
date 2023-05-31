import { IsString, Length } from 'class-validator';

export class CommentInputModel {
  @IsString()
  @Length(20, 300)
  content: string;
}

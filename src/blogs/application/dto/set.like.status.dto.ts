import { Matches } from 'class-validator';

export class SetLikeStatusDto {
  @Matches('None|Like|Dislike')
  likeStatus: string;
}

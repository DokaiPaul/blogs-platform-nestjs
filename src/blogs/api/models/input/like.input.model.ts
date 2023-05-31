import { Matches } from 'class-validator';

export class LikeInputModel {
  @Matches('None|Like|Dislike')
  likeStatus: string;
}

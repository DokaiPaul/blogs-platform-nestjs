import { Matches } from 'class-validator';

export class SetLikeStatusDto {
  @Matches('None|Like|Dislike')
  likeStatus: string;
}

class LikeStatusDto {
  status: string;
  userId: string;
  login: string;
}

export class CommentLikeStatusDto extends LikeStatusDto {
  commentId: string;
}

export class PostLikeStatusDto extends LikeStatusDto {
  postId: string;
}

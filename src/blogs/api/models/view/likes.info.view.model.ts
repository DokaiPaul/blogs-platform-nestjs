export type LikesInfoViewModel = {
  likesCount: number;
  dislikesCount: number;
  myStatus: LikeStatus;
};

export type ExtendedLikesInfoViewModel = {
  likesCount: number;
  dislikesCount: number;
  myStatus: LikeStatus;
  newestLikes: LikeDetailsViewModel[];
};

type LikeDetailsViewModel = {
  description: string;
  addedAt: string;
  userId: string;
  login: string;
};

enum LikeStatus {
  None = 'None',
  Like = 'Like',
  Dislike = 'Dislike',
}

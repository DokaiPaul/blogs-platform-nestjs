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

export type LikeDetailsViewModel = {
  addedAt: string;
  userId: string;
  login: string;
};

export enum LikeStatus {
  None = 'None',
  Like = 'Like',
  Dislike = 'Dislike',
}

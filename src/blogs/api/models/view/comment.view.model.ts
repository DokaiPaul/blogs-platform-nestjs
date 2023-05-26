import { LikesInfoViewModel } from './likes.info.view.model';

export type CommentViewModel = {
  id: string;
  content: string;
  createdAt: string;
  commentatorInfo: CommentatorInfo;
  likesInfo: LikesInfoViewModel;
};

type CommentatorInfo = {
  userId: string;
  userLogin: string;
};

import { LikesInfoViewModel } from './likes.info.view.model';

export type CommentViewModel = {
  id: string;
  content: string;
  createdAt: string;
  commentatorInfo: CommentatorInfo;
  likesInfo: LikesInfoViewModel;
};

export type CommentToBloggerViewModel = {
  id: string;
  content: string;
  createdAt: string;
  commentatorInfo: CommentatorInfo;
  likesInfo: LikesInfoViewModel;
  postInfo: PostInfo;
};

export type CommentatorInfo = {
  userId: string;
  userLogin: string;
};

type PostInfo = {
  id: string;
  title: string;
  blogId: string;
  blogName: string;
};

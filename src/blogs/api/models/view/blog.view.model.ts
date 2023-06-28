import { BlogOwnerInfo } from '../../../infrastructure/blog.schema';

type BanInfo = {
  isBanned: boolean;
  banDate: string;
};

export type BlogViewModel = {
  id: string;
  name: string;
  description: string;
  websiteUrl: string;
  createdAt: string;
  isMembership: boolean;
};

export type saBlogViewModel = {
  id: string;
  name: string;
  description: string;
  websiteUrl: string;
  createdAt: string;
  isMembership: boolean;
  blogOwnerInfo: BlogOwnerInfo;
  banInfo: BanInfo;
};

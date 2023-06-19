import { BanInfo } from '../../../infrastructure/users.schema';

export type UserViewModel = {
  id: string;
  login: string;
  email: string;
  createdAt: string;
  banInfo: BanInfo;
};

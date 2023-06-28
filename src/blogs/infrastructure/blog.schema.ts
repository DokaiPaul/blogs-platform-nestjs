import { HydratedDocument } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { BanInfo } from '../../users/infrastructure/users.schema';

export type BlogDocument = HydratedDocument<Blog>;

@Schema()
export class BlogOwnerInfo {
  @Prop()
  userId: string | null;

  @Prop()
  userLogin: string | null;
}

@Schema()
class BanBlogInfo {
  @Prop({ required: true })
  isBanned: boolean;

  @Prop({ required: true })
  banDate: string;
}

@Schema()
export class BlackListInfo {
  @Prop({ required: true })
  id: string;

  @Prop({ required: true })
  login: string;

  @Prop({ required: true })
  banInfo: BanInfo;
}

@Schema()
export class Blog {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  description: string;

  @Prop({ required: true })
  websiteUrl: string;

  @Prop({ default: new Date().toISOString() })
  createdAt: string;

  @Prop({ default: false })
  isMembership: boolean;

  @Prop({ default: false })
  isHidden?: boolean;

  @Prop({ required: true })
  blogOwnerInfo: BlogOwnerInfo;

  @Prop({ required: true })
  banInfo: BanBlogInfo;

  @Prop({ default: [] })
  blackList: BlackListInfo[];
}

export const BlogSchema = SchemaFactory.createForClass(Blog);

import { HydratedDocument } from 'mongoose';
import { BlogViewModel } from '../api/models/view/blog.view.model';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

export type BlogDocument = HydratedDocument<BlogViewModel>;

@Schema()
export class BlogOwnerInfo {
  @Prop()
  userId: string | null;

  @Prop()
  userLogin: string | null;
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
}

export const BlogSchema = SchemaFactory.createForClass(Blog);

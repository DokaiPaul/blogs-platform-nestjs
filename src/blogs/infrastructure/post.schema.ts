import { HydratedDocument } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { LikeDetailsViewModel } from '../api/models/view/likes.info.view.model';

export type PostDocument = HydratedDocument<Post>;

@Schema()
export class Post {
  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  shortDescription: string;

  @Prop({ required: true })
  content: string;

  @Prop({ required: true })
  blogId: string;

  @Prop({ required: true })
  blogName: string;

  @Prop({ default: new Date().toISOString() })
  createdAt: string;

  @Prop({ required: true })
  likes: LikeDetailsViewModel[];

  @Prop({ required: true })
  dislikes: LikeDetailsViewModel[];
}

export const PostSchema = SchemaFactory.createForClass(Post);

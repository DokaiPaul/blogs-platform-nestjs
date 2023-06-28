import { HydratedDocument } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { LikeDetailsViewModel } from '../api/models/view/likes.info.view.model';

export type CommentDocument = HydratedDocument<Comment>;

@Schema()
class PostInfo {
  @Prop({ required: true })
  id: string;

  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  blogId: string;

  @Prop({ required: true })
  blogName: string;
}

@Schema()
export class Comment {
  @Prop({ required: true })
  content: string;

  @Prop({ required: true })
  likes: LikeDetailsViewModel[];

  @Prop({ required: true })
  dislikes: LikeDetailsViewModel[];

  @Prop({ default: new Date().toISOString() })
  createdAt: string;

  @Prop({ required: true, type: { userId: String, userLogin: String } })
  commentatorInfo: { userId: string; userLogin: string };

  @Prop({ required: true })
  postInfo: PostInfo;

  @Prop({ default: false })
  isHidden?: boolean;
}

export const CommentSchema = SchemaFactory.createForClass(Comment);

import { HydratedDocument } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

export type UserDocument = HydratedDocument<User>;

@Schema()
export class User {
  @Prop({ required: true, unique: true })
  login: string;

  @Prop({ required: true })
  passwordHash: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ default: new Date().toISOString() })
  createdAt: string;
}

export const UserSchema = SchemaFactory.createForClass(User);

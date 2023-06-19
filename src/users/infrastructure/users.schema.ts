import { HydratedDocument } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

export type UserDocument = HydratedDocument<User>;

@Schema()
export class EmailConfirmation {
  @Prop({ required: true })
  confirmationCode: string;
  @Prop({ required: true })
  expirationDate: string;
  @Prop({ required: true })
  isConfirmed: boolean;
}

@Schema()
export class BanInfo {
  @Prop({ required: true })
  isBanned: boolean;

  @Prop()
  banDate: string | null;

  @Prop()
  banReason: string | null;
}

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

  @Prop({ required: true })
  emailConfirmation: EmailConfirmation;

  @Prop({ required: true })
  banInfo: BanInfo;
}

export const UserSchema = SchemaFactory.createForClass(User);

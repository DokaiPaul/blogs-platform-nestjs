import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type ActiveSessionDocument = HydratedDocument<ActiveSession>;

@Schema()
export class ActiveSession {
  @Prop({ required: true })
  ip: string;

  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  lastActivateDate: string;

  @Prop({ required: true })
  deviceId: string;

  @Prop({ required: true })
  userId: string;

  @Prop({ required: true })
  tokenExpirationDate: string;
}

export const ActiveSessionSchema = SchemaFactory.createForClass(ActiveSession);

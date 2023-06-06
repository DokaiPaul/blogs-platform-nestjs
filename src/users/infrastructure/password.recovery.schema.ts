import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type PasswordRecoveryDocument = HydratedDocument<PasswordRecovery>;

@Schema()
export class PasswordRecovery {
  @Prop({ required: true })
  confirmationCode: string;

  @Prop({ default: new Date().toISOString() })
  creationDate: string;

  @Prop({ required: true })
  email: any;

  @Prop({ default: false })
  isUsed: boolean;
}

export const PasswordRecoverySchema =
  SchemaFactory.createForClass(PasswordRecovery);

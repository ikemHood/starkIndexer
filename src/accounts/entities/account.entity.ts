import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class Account extends Document {
  @Prop({ required: true, unique: true })
  ownerAddress: string;

  @Prop({ required: true })
  guardianAddress: string;

  @Prop({ required: true })
  transactionHash: string;

  @Prop({ required: true })
  BlockNumber: number;

  @Prop({ required: true })
  createdAt: Date;
}

export const AccountSchema = SchemaFactory.createForClass(Account);

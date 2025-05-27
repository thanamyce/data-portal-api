import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type TaskDocument = Transaction & Document;

@Schema({ timestamps: true })
export class Transaction extends Document {

  @Prop({required: true, unique: true})
  transactionId: string;

  @Prop()
  csvFileName: string;

  @Prop()
  createdBy: string;

  @Prop({default: Date.now})
  createdAt: Date
}

export const TransactionSchema = SchemaFactory.createForClass(Transaction);

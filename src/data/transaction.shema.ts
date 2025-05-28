import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type TransactionDocument = Transaction & Document;

type action = "Upload" | "Export";
@Schema({ timestamps: true })
export class Transaction extends Document {

  @Prop()
  csvFileName: string;

  @Prop({default:"Upload"})
  action: action;

  @Prop()
  dataSize: number;

  @Prop()
  createdBy: string;

  @Prop({default: false})
  isSuccessed: boolean;

  @Prop({default: Date.now})
  createdAt: Date
}

export const TransactionSchema = SchemaFactory.createForClass(Transaction);

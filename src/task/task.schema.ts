import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type TaskDocument = Task & Document;

@Schema({ timestamps: true })
export class Task extends Document {

  @Prop({required: true, unique: true})
  linkedinId: string;

  @Prop({ required: true })
  type: string; // 'company' or 'contact'

  @Prop({required: true})
  statement: string[];
  
  @Prop({ type: Object })
  data: Record<string, any>;

  @Prop({ default: 'incomplete' })
  status: string;
}

export const TaskSchema = SchemaFactory.createForClass(Task);

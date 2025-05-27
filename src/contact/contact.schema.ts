import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { Schema as MongooseSchema } from 'mongoose';

export type ContactDocument = Contact & Document;

@Schema({ collection: 'contactData', timestamps: true })
export class Contact extends Document {
  
  @Prop()
  firstName: string;

  @Prop()
  lastName: string;

  @Prop({ unique: true, sparse: true })
  contactLinkedinProfile: string;

  @Prop()
  emailAddress: string;

  @Prop()
  phoneNumber: string;

  @Prop()
  mobileNumber: string;

  @Prop()
  title: string;

  @Prop()
  level: string;

  @Prop()
  companyExtension: string;

  @Prop()
  address: string;

  @Prop()
  companyId: string;

  @Prop({ default: Date.now })
  lastUpdated: Date;
}

export const ContactSchema = SchemaFactory.createForClass(Contact);

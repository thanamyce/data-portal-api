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

  @Prop()
  department: string;

  @Prop()
  jobTitle: string;

  @Prop()
  jobTitleLevel: string;

  @Prop()
  jobTitleRole: string;

  @Prop()
  jobSubRole: string;

  @Prop()
  pastCompany: string;

  @Prop()
  location: string;

  @Prop()
  locality: string;

  @Prop()
  skills: string[];

  @Prop()
  education: string;

  @Prop()
  region: string;

  @Prop()
  country: string;

  @Prop({ unique: true, sparse: true })
  contactLinkedinProfile: string; // Previously contactLinkedinProfile

  @Prop({ unique: true, sparse: true })
  professionalEmail: string;

  @Prop()
  professionalEmailStatus: string;

  @Prop({ unique: true, sparse: true })
  personalEmail: string;

  @Prop()
  personalEmailStatus: string;

  @Prop()
  phoneNumber1: string;

  @Prop()
  phoneNumber2: string;

  @Prop()
  companyExtension: string;

 @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Company' })
  companyId: MongooseSchema.Types.ObjectId;

 @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Transactions' })
  transactionId: MongooseSchema.Types.ObjectId;

  @Prop({ default: Date.now })
  lastUpdated: Date;
}

export const ContactSchema = SchemaFactory.createForClass(Contact);

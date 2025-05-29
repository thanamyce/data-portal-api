import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { Schema as MongooseSchema } from 'mongoose';
import { jobLevel, jobRole, jobSubRole, RegionGroup } from 'src/util/enum';

export type ContactDocument = Contact & Document;


@Schema({ collection: 'contactData', timestamps: true })
export class Contact extends Document {

  @Prop()
  firstName: string;

  @Prop()
  lastName: string;

  @Prop()
  jobTitle: string;

  @Prop()
  jobLevel: jobLevel;

  @Prop()
  jobRole: jobRole;

  @Prop()
  jobSubRole: jobSubRole;

  @Prop()
  department: string;

  @Prop()
  skills:string;

  @Prop()
  school: string;

  @Prop()
  major: string;

  @Prop()
  location: string;

  @Prop()
  locality: string;

  @Prop()
  region: RegionGroup;

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

  @Prop()
  companyLinkedin: string;

 @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Company',required: false })
  companyId: MongooseSchema.Types.ObjectId;

 @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Transactions' })
  transactionId: MongooseSchema.Types.ObjectId;

  @Prop({ default: Date.now })
  lastUpdated: Date;
}

export const ContactSchema = SchemaFactory.createForClass(Contact);

import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import {Schema as MongooseSchema} from 'mongoose'

enum companyTypes  {
  "Private",
  "Public",
  "Educational",
  "Government",
  "NonProfit",
  "PublicSubsidiary"
}

export type CompanyDocument = Company & Document;

@Schema({ timestamps: true })
export class Company extends Document {

  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  domain: string;

  @Prop({ unique: true, sparse: true })
  linkedinUrl: string;

  @Prop()
  emailPattern: string;

  @Prop()
  address: string;

  @Prop()
  location: string;

  @Prop()
  street: string;

  @Prop()
  locality: string;

  @Prop()
  region: string;

  @Prop()
  country: string;

  @Prop()
  postalCode: string;

  @Prop()
  companyPhoneNumber: string;

  @Prop()
  employeeRange: string;

  @Prop()
  revenueRange: string;

  @Prop()
  industry: string;

  @Prop()
  subIndustry: string;

  @Prop()
  foundedYear: number;

  @Prop()
  totalFunding: string;

  @Prop()
  companyType: companyTypes;

  @Prop()
  twitterUrl: string;

  @Prop()
  facebookUrl: string;

  @Prop()
  description: string;

  @Prop()
  lastFundingRound: string;

  @Prop()
  lastFundingAmount: string;

  @Prop()
  lastFundingDate: string;

  @Prop({ type: [String] })
  otherWorkEmails: string[];

  @Prop()
  lastValidityDate: string;

 @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Transactions' })
  transactionId: MongooseSchema.Types.ObjectId;
}


export const CompanySchema = SchemaFactory.createForClass(Company);

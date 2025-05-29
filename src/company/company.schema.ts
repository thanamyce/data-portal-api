import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import {Schema as MongooseSchema} from 'mongoose'
import { CompanyType, EmployeeRange, Industry, IndustryClassification, RegionGroup, RevenueRange } from 'src/util/enum';


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
  region: RegionGroup;

  @Prop()
  country: string;

  @Prop()
  postalCode: string;

  @Prop()
  companyPhoneNumber: string;

  @Prop()
  employeeRange: EmployeeRange;

  @Prop()
  revenueRange: RevenueRange;

  @Prop()
  industry: Industry;

  @Prop()
  subIndustry: string;

  @Prop()
  industryClassification: IndustryClassification;

  @Prop()
  industryClassificationCode: string;

  @Prop()
  foundedYear: number;

  @Prop()
  totalFunding: string;

  @Prop()
  companyType: CompanyType;

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

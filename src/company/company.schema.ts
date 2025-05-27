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

  @Prop({required: true})
  domain: string;

  @Prop({ unique: true, sparse: true })
  linkedinUrl: string;

  @Prop()
  emailPattern: string;

  @Prop()
  address: string;

  @Prop()
  companyPhoneNumber: string;

  @Prop()
  employeeRange: string;

  @Prop()
  revenueRange: string;

  @Prop()
  industry: string;

  @Prop({ type: [String] })
  unknownFields: string[];

  @Prop()
  lastValidityDate: string;
}

export const CompanySchema = SchemaFactory.createForClass(Company);

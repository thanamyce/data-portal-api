import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { Schema as MongooseSchema } from 'mongoose';

export type ContactDocument = Contact & Document;

export enum jobLevel {
  CXO = "CXO",
  VP = "VP",
  Director = "DIRECTOR",
  Entry = "ENTRY",
  Manager = "MANAGER",
  Owner = "OWNER",
  Partner = "PARTNER",
  Senior = "SENIOR",
  Training = "TRAINING",
  Unpaid = "UNPAID"
}

export enum jobRole {
  CustomerService = "CUSTOMER SERVICE",
  Design = "DESIGN",
  Education = "EDUCATION",
  Engineering = "ENGINEERING",
  Finance = "FINANCE",
  Health = "HEALTH",
  HumanResources = "HUMAN RESOURCES",
  Legal = "LEGAL",
  Marketing = "MARKETING",
  Media = "MEDIA",
  Operations = "OPERATIONS",
  PublicRelations = "PUBLIC RELATIONS",
  RealEstate = "REAL ESTATE",
  Sales = "SALES",
  Trades = "TRADES"
}

export enum jobSubRole {
  Accounting = "ACCOUNTING",
  Accounts = "ACCOUNTS",
  BrandMarketing = "BRAND MARKETING",
  Broadcasting = "BROADCASTING",
  BusinessDevelopment = "BUSINESS DEVELOPMENT",
  Compensation = "COMPENSATION",
  ContentMarketing = "CONTENT MARKETING",
  CustomerSuccess = "CUSTOMER SUCCESS",
  Data = "DATA",
  Dental = "DENTAL",
  Devops = "DEVOPS",
  Doctor = "DOCTOR",
  Editorial = "EDITORIAL",
  EducationAdministration = "EDUCATION ADMINISTRATION",
  Electrical = "ELECTRICAL",
  EmployeeDevelopment = "EMPLOYEE DEVELOPMENT",
  Events = "EVENTS",
  Fitness = "FITNESS",
  GraphicDesign = "GRAPHIC DESIGN",
  InformationTechnology = "INFORMATION TECHNOLOGY",
  Instructor = "INSTRUCTOR",
  Investment = "INVESTMENT",
  Journalism = "JOURNALISM",
  Judicial = "JUDICIAL",
  Lawyer = "LAWYER",
  Logistics = "LOGISTICS",
  MarketingCommunications = "MARKETING COMMUNICATIONS",
  Mechanical = "MECHANICAL",
  MediaRelations = "MEDIA RELATIONS",
  Network = "NETWORK",
  Nursing = "NURSING",
  OfficeManagement = "OFFICE MANAGEMENT",
  Paralegal = "PARALEGAL",
  Pipeline = "PIPELINE",
  Product = "PRODUCT",
  ProductDesign = "PRODUCT DESIGN",
  ProductMarketing = "PRODUCT MARKETING",
  Professor = "PROFESSOR",
  ProjectEngineering = "PROJECT ENGINEERING",
  ProjectManagement = "PROJECT MANAGEMENT",
  PropertyManagement = "PROPERTY MANAGEMENT",
  QualityAssurance = "QUALITY ASSURANCE",
  Realtor = "REALTOR",
  Recruiting = "RECRUITING",
  Researcher = "RESEARCHER",
  Security = "SECURITY",
  Software = "SOFTWARE",
  Support = "SUPPORT",
  Systems = "SYSTEMS",
  Tax = "TAX",
  Teacher = "TEACHER",
  Therapy = "THERAPY",
  Video = "VIDEO",
  Web = "WEB",
  WebDesign = "WEB DESIGN",
  Wellness = "WELLNESS",
  Writing = "WRITING"
}

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
  education: string;

  @Prop()
  location: string;

  @Prop()
  locality: string;

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

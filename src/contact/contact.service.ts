import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Contact, ContactDocument } from './contact.schema';
import { Model } from 'mongoose';
import { Company, CompanyDocument } from 'src/company/company.schema';

@Injectable()
export class ContactService {
  constructor(
    @InjectModel(Contact.name) private contactModel: Model<ContactDocument>,
    @InjectModel(Company.name) private companyModel: Model<CompanyDocument>,
  ) {}

  async createFromCSV(data: Partial<Contact>, updateExisting,transactionId,validFieldMapping): Promise<Contact | any> {
  
const contactValidFields = validFieldMapping.contact;

  if (!data.contactLinkedinProfile) {
    throw new Error('Missing required field: contactLinkedinProfile');
  }
  const record = await this.contactModel.findOne({contactLinkedinProfile: data.contactLinkedinProfile})
  if (record && !updateExisting) {
    return { matched: true,isDuplicate: true, inserted: false, message: `Duplicate contact ${data.contactLinkedinProfile}, skipped insert` };
  }
  if (data.jobLevel && contactValidFields.jobLevel[data.jobLevel]) {
  data.jobLevel = contactValidFields.jobLevel[data.jobLevel];
}
if (data.jobRole && contactValidFields.jobRole[data.jobRole]) {
  data.jobRole = contactValidFields.jobRole[data.jobRole];
}
if (data.jobSubRole && contactValidFields.jobSubRole[data.jobSubRole]) {
  data.jobSubRole = contactValidFields.jobSubRole[data.jobSubRole];
}
if(data.region && contactValidFields.region[data.region]){
  data.region = contactValidFields.region[data.region];
}

  const company:any = await this.companyModel.findOne({linkedinUrl: data.companyLinkedin})
  if(company){
    data.companyId= company._id;
  }
  data.transactionId = transactionId;
  if (updateExisting) {
  // Normal upsert: update if exists, insert if not
  const result = await this.contactModel.updateOne(
    { contactLinkedinProfile: data.contactLinkedinProfile },
    { $set: data },
    { upsert: true }
  );
  return result;
} else {
  // Check if document exists
  const existing = await this.contactModel.findOne({
    contactLinkedinProfile: data.contactLinkedinProfile,
  });

  if (existing) {
    // Document exists, do NOT update
    return { matched: true, inserted: false };
  } else {
    // Insert new document
    const inserted = await this.contactModel.create(data);
    return { matched: false, inserted: true, document: inserted };
  }
}

}

}


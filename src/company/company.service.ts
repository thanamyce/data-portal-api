import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Company, CompanyDocument } from './company.schema';
import { Model } from 'mongoose';

@Injectable()
export class CompanyService {
  constructor(
    @InjectModel(Company.name) private companyModel: Model<CompanyDocument | any>,
  ) {}

  async createFromCSV(data: Partial<Company>, updateExisting): Promise<Company | any> {
    
  if (!data.linkedinUrl) {
    throw new Error('Missing required field: LinkdinUri');
  }
    if (updateExisting) {
  // Normal upsert: update if exists, insert if not
  const result = await this.companyModel.updateOne(
    { linkedinUrl: data.linkedinUrl },
    { $set: data },
    { upsert: true }
  );
  return result;
} else {
  // Check if document exists
  const existing = await this.companyModel.findOne({
    linkedinUrl: data.linkedinUrl,
  });

  if (existing) {
    // Document exists, do NOT update
    return { matched: true, inserted: false };
  } else {
    // Insert new document
    const inserted = await this.companyModel.create(data);
    return { matched: false, inserted: true, document: inserted };
  }
}


    // Return the existing or new document
    return this.companyModel.findOne({ linkedinUrl: data.linkedinUrl }).exec();
  }
}


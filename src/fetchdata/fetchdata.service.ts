// src/contacts/contacts.service.ts
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

import { Model } from 'mongoose';
import { Contact, ContactDocument } from 'src/contact/contact.schema';
import { NestedContactFilterDto } from './filter.dto';
import { Company, CompanyDocument } from 'src/company/company.schema';


@Injectable()
export class  FetchdataService { constructor(
    @InjectModel(Contact.name) private contactModel: Model<ContactDocument>,
    @InjectModel(Company.name) private companyModel: Model<CompanyDocument>
  ) {}

async filterContactsAndCompanies(filterDto: NestedContactFilterDto) {
  const contactFilters: any[] = [];
  const companyFilters: any[] = [];

  const buildRegexFilter = (field: string, value: any) => {
    if (Array.isArray(value)) {
      return {
        $or: value.map((v) => ({
          [field]: { $regex: v, $options: 'i' }
        }))
      };
    }
    if (typeof value === 'string') {
      const words = value.trim().split(/\s+/);
      return {
        $or: [
          { [field]: { $regex: value, $options: 'i' } },
        ]
      };
    }
    return { [field]: value };
  };

  if (filterDto.contact) {
    for (const [key, value] of Object.entries(filterDto.contact)) {
      if (value !== undefined && value !== null && value !== '') {
        contactFilters.push(buildRegexFilter(key, value));
      }
    }
  }

  if (filterDto.company) {
    for (const [key, value] of Object.entries(filterDto.company)) {
      if (value !== undefined && value !== null && value !== '') {
        companyFilters.push(buildRegexFilter(key, value));
      }
    }
  }

  let contactQuery = [];
  let companyQuery = [];

  if (contactFilters.length > 0) {
    contactQuery = await this.contactModel.find({ $and: contactFilters });
  }

  if (companyFilters.length > 0) {
    companyQuery = await this.companyModel.find({ $and: companyFilters });
  }

  return {
    contacts: contactQuery,
    companies: companyQuery
  };
}



}


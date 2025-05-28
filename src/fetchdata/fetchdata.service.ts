// src/contacts/contacts.service.ts
import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

import { Model } from 'mongoose';
import { Contact, ContactDocument } from 'src/contact/contact.schema';
import { NestedContactFilterDto } from './filter.dto';
import { Company, CompanyDocument } from 'src/company/company.schema';
import { ResponseHelper } from 'src/util/ResponseHelper';


@Injectable()
export class  FetchdataService { constructor(
    @InjectModel(Contact.name) private contactModel: Model<ContactDocument>,
    @InjectModel(Company.name) private companyModel: Model<CompanyDocument>
  ) {}

async filterContactsAndCompanies(filterDto: NestedContactFilterDto & { exclude?: any }) {try {
  
    const contactFilters: any[] = [];
    const companyFilters: any[] = [];
    const contactExcludes: any[] = [];
    const companyExcludes: any[] = [];
  
    const buildRegexFilter = (field: string, value: any) => {
      if (Array.isArray(value)) {
        return {
          $or: value.map((v) => ({
            [field]: { $regex: v, $options: 'i' }
          }))
        };
      }
      if (typeof value === 'string') {
        return {
          $or: [
            { [field]: { $regex: value, $options: 'i' } },
          ]
        };
      }
      return { [field]: value };
    };
  
    // ✅ Include filters
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
  
   const buildExcludeFilter = (field: string, value: any) => {
    if (Array.isArray(value)) {
      return {
        $nor: value.map(v => ({
          [field]: { $regex: v, $options: 'i' }
        }))
      };
    }
    return {
      [field]: { $not: { $regex: value, $options: 'i' } }
    };
  };
  
  // Exclude: CONTACT
  if (filterDto.exclude?.contact) {
    for (const [key, value] of Object.entries(filterDto.exclude.contact)) {
      if (value !== undefined && value !== null && value !== '') {
        contactExcludes.push(buildExcludeFilter(key, value));
      }
    }
  }
  
  // Exclude: COMPANY
  if (filterDto.exclude?.company) {
    for (const [key, value] of Object.entries(filterDto.exclude.company)) {
      if (value !== undefined && value !== null && value !== '') {
        companyExcludes.push(buildExcludeFilter(key, value));
      }
    }
  }
  
    let contactQuery:any = [];
  let finalContacts = [];
  let matchedCompanyIds: any[] = [];
  let contactMatch: any = {};
  let companyMatch: any = {};
  
  if (contactFilters.length > 0 || contactExcludes.length > 0) {
    contactMatch = { $and: [...contactFilters, ...contactExcludes, { companyId: { $ne: null } }] };
  }
  
  // Step 1: If contact filters provided, get contacts first
  if (Object.keys(contactMatch).length > 0) {
    contactQuery = await this.contactModel.find(contactMatch).select('companyId');
    const companyIdsFromContacts = contactQuery.map(c => c.companyId);
  
    // Step 2: Apply company filters to only related companies
    if (companyFilters.length > 0 || companyExcludes.length > 0) {
      const companies = await this.companyModel.find({
        $and: [...companyFilters, ...companyExcludes, { _id: { $in: companyIdsFromContacts } }]
      });
      matchedCompanyIds = companies.map(c => c._id);
    } else {
      // No company filters, just use company IDs from contacts
      matchedCompanyIds = companyIdsFromContacts;
    }
  } else if (companyFilters.length > 0 || companyExcludes.length > 0) {
    // Step 3: No contact filters, but company filters exist — so start from companies
    const companies = await this.companyModel.find({
      $and: [...companyFilters, ...companyExcludes]
    });
    matchedCompanyIds = companies.map(c => c._id);
  }
  
  // Step 4: Final contact query using matched company IDs
  if (matchedCompanyIds.length > 0) {
    finalContacts = await this.contactModel.find({
      ...(Object.keys(contactMatch).length > 0 ? contactMatch : {}),
      companyId: { $in: matchedCompanyIds }
    }).populate({
      path: 'companyId',
      select: '-createdAt -updatedAt -__v -_id'
    }).select('-_id -createdAt -updatedAt -__v');
  }
  
  return ResponseHelper.success(finalContacts,"SUccessfully data fetched",HttpStatus.OK)

  
  
  
} catch (error) {
  return ResponseHelper.error(error,"Failed to fetch data",HttpStatus.INTERNAL_SERVER_ERROR)
}
}
}


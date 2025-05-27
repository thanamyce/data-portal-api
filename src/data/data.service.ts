import { Injectable, InternalServerErrorException, Logger, BadRequestException } from '@nestjs/common';
import * as fs from 'fs';
import * as csvParser from 'csv-parser';
import { CompanyService } from '../company/company.service';
import { ContactService } from '../contact/contact.service';
import { TaskService } from '../task/task.service';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Company, CompanyDocument } from 'src/company/company.schema';
import { Contact, ContactDocument } from 'src/contact/contact.schema';

@Injectable()
export class DataService {
  private readonly logger = new Logger(DataService.name);
// public readonly companySchemaFields = [
//     'name',
//     'domain',
//     'linkedinUrl',
//     'emailPattern',
//     'address',
//     'companyPhoneNumber',
//     'employeeRange',
//     'revenueRange',
//     'industry',
//     'unknownFields',
//     'lastValidityDate',
//   ];

//   public readonly contactSchemaFields = [
//     'firstName',
//     'lastName',
//     'contactLinkedinProfile',
//     'emailAddress',
//     'phoneNumber',
//     'mobileNumber',
//     'title',
//     'level',
//     'companyExtension',
//     'address',
//     'companyId',
//     'lastUpdated',
//   ];

  constructor(
    private readonly companyService: CompanyService,
    private readonly contactService: ContactService,
    private readonly taskService: TaskService,
    @InjectModel(Company.name) private companyModel: Model<CompanyDocument | any>,
    @InjectModel(Contact.name) private contactModel: Model<ContactDocument | any>
  ) {
  }

    get contactSchemaFields(): string[] {
    return Object.keys(this.contactModel.schema.paths).filter(
      (key) => !['_id', '__v', 'createdAt', 'updatedAt'].includes(key)
    );
  }

  // ✅ Dynamic getter for Company schema fields
  get companySchemaFields(): string[] {
    return Object.keys(this.companyModel.schema.paths).filter(
      (key) => !['_id', '__v', 'createdAt', 'updatedAt'].includes(key)
    );
  }


  /**
   * Extract headers from first line of CSV
   */
  async extractHeaders(filePath: string): Promise<string[]> {
    return new Promise((resolve, reject) => {
      fs.createReadStream(filePath)
        .pipe(csvParser())
        .on('headers', (headers: string[]) => {
          resolve(headers);
        })
        .on('error', (err) => {
          this.logger.error(`CSV header extraction failed: ${err.message}`);
          reject(new InternalServerErrorException('Failed to extract headers from CSV'));
        });
    });
  }

  async getCompanyFields(){
    return this.companySchemaFields;
  }

  async getContactFields(){
    return this.contactSchemaFields;
  }

  /**
   * Process the CSV file with field mapping, validation, and routing.
   */
  async processWithMapping(
    filePath: string,
    mapping: Record<string, string>,
    requiredCompanyFields: string[],
    semiRequiredCompanyFields: string[],
    requiredContactFields: string[],
    semiRequiredContactFields: string[],
    isCompany: boolean,
    isContact: boolean,
    updateExisting: boolean,
  ): Promise<{ message: string; totalRows: number; successCount: number; errorCount: number; errors: string[],duplicateValues: string[], invalidData: string[] }> {
    const rows: any[] = [];
    const errors: any[] = [];
    let successCount = 0;
    const invalidData: any = [];
    const duplicateValues: any = [];
    try {
      await new Promise<void>((resolve, reject) => {
        fs.createReadStream(filePath)
          .pipe(csvParser())
          .on('data', (row) => rows.push(row))
          .on('end', () => resolve())
          .on('error', (err) => reject(err));
      });
    } catch (err) {
      this.logger.error(`CSV parsing failed: ${err.message}`);
      throw new InternalServerErrorException(`CSV parse error: ${err.message}`);
    }

    for (const [index, rawRow] of rows.entries()) {
      try {
        const mappedRow = this.mapRowToSchema(rawRow, mapping);

        // COMPANY
        if (isCompany) {
          const companyData = this.filterFields(mappedRow, this.companySchemaFields);
          const isValid = this.checkRequiredFields(companyData, requiredCompanyFields);
          if(!isValid){
            const result = Object.fromEntries(
              requiredCompanyFields.map((key) => [key, companyData[key]])
           );

            invalidData.push({ type: "company", companyData: result });
          }else{
            const semiContain = this.checkSemiRequiredFields(companyData,semiRequiredCompanyFields);
            if(semiContain){
                const res = await this.companyService.createFromCSV(companyData,updateExisting);
                if(res.isDuplicate){
                  duplicateValues.push(res.message)
                }
            }else{
                await this.taskService.createIncompleteTask("company", companyData, requiredCompanyFields, semiRequiredCompanyFields);
            }
          }

        }

        // CONTACT
        if (isContact) {
          const contactData = this.filterFields(mappedRow, this.contactSchemaFields);
          const isValid = this.checkRequiredFields(contactData, requiredContactFields);

          if(!isValid){
            const result = Object.fromEntries(
                 requiredContactFields.map((key) => [key, contactData[key]])
                 );

            invalidData.push({ type: "contact", companyData: result });
          }else{
            const semiContain = this.checkSemiRequiredFields(contactData,semiRequiredContactFields);
            if(semiContain){
                const res = await this.contactService.createFromCSV(contactData,updateExisting);
                 if(res.isDuplicate){
                  duplicateValues.push(res.message)
                }
            }else{
                await this.taskService.createIncompleteTask("company", contactData, requiredContactFields, semiRequiredContactFields);
            }
          }
          
        }

        successCount++;
      } catch (err) {
        this.logger.error(`Row ${index + 1} failed: ${err.message}`);
        errors.push({ row: index + 1, message: err.message });
        continue;
      }
    }

    // Remove file after processing
    fs.unlink(filePath, (err) => {
      if (err) this.logger.warn(`File cleanup failed: ${err.message}`);
    });

    return {
      message: 'CSV processed with results',
      totalRows: rows.length,
      successCount,
      errorCount: errors.length,
      errors: errors,
      duplicateValues: duplicateValues,
      invalidData: invalidData
    };
  }

  private mapRowToSchema(row: any, mapping: Record<string, string>): any {
    const result: any = {};
    for (const [schemaField, csvHeader] of Object.entries(mapping)) {
      result[schemaField] = row[csvHeader];
    }
    return result;
  }

  private filterFields(data: any, allowedFields: string[]): any {
    const result: any = {};
    for (const key of allowedFields) {
      if (data[key] !== undefined) {
        result[key] = data[key];
      }
    }
    return result;
  }

  private checkRequiredFields(data: Record<string, any>, requiredFields: string[]): boolean {
    return requiredFields.every(
      (field) => data[field] != null && `${data[field]}`.trim() !== ''
    );
  }
  private checkSemiRequiredFields(data: Record<string, any>, requiredFields: string[]): boolean {
    return requiredFields.every(
      (field) => data[field] != null && `${data[field]}`.trim() !== ''
    );
  }
}

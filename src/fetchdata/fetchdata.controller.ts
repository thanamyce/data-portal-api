// src/contacts/contacts.controller.ts
import { Controller, Post, Body, UseGuards, Res, HttpStatus } from '@nestjs/common';
import { FetchdataService } from './fetchdata.service';
import { ExportContactDto, NestedContactFilterDto } from './filter.dto';
import { AuthGuard } from 'src/auth/auth.guard';
import { Parser } from 'json2csv';
import { Response } from 'express';
import { InjectModel } from '@nestjs/mongoose';
import { Transaction, TransactionDocument } from 'src/data/transaction.shema';
import { Model } from 'mongoose';
import { ReqUser } from 'src/util/decorate';
import { ResponseHelper } from 'src/util/ResponseHelper';




@Controller('data')
export class FetchdataController {
  constructor(private readonly contactsService: FetchdataService,
    @InjectModel(Transaction.name) private readonly transactionModel : Model<TransactionDocument>
  ) {}

  @UseGuards(AuthGuard)
  @Post('search')
  async filterContactsByNestedObject(@Body() filterDto: NestedContactFilterDto) {
    return this.contactsService.filterContactsAndCompanies(filterDto);
  }

  @UseGuards(AuthGuard)
  @Post('export')
 async exportData(
    @Body() body:ExportContactDto,
    @Res() res: Response,
    @ReqUser() reqUser: any
  ) {
   try {
     // Call your service to get the full response object
     const response = await this.contactsService.exportContactsAndCompanies(body);
    const selectedFields = body.fields || [];
     // Extract the `data` array from the response
     const dataArray:any = response.data;
 
     // Flatten each item in the array by lifting companyId fields up one level
     let flattened = dataArray.map(item => {
       const doc = item.toObject();
       const { companyId, ...rest } = doc;
 
       return {
         ...rest,
         companyName: companyId?.name || '',
         companyDomain: companyId?.domain || '',
         companyLinkedinUrl: companyId?.linkedinUrl || '',
         emailPattern: companyId?.emailPattern || '',
         companyAddress: companyId?.address || '',
         companyLocation: companyId?.location || '',
         companyLocality: companyId?.locality || '',
         companyRegion: companyId?.region || '',
         companyCountry: companyId?.country || '',
         companyPhoneNumber: companyId?.companyPhoneNumber || '',
         employeeRange: companyId?.employeeRange || '',
         revenueRange: companyId?.revenueRange || '',
         industry: companyId?.industry || '',
         lastValidityDate: companyId?.lastValidityDate || '',
       };
     });
 
      if (selectedFields.length > 0) {
  flattened = flattened.map(record =>
    Object.fromEntries(
      Object.entries(record).filter(([key]) => selectedFields.includes(key))
    )
  );
}
     const parser = new Parser();
     const csv = parser.parse(flattened);
 
     const transaction = await this.transactionModel.create({
       csvFileName: body.fileName,
       action: "Export",
       dataSize: dataArray.length,
       createdBy: reqUser.id,
       isSuccessed: true
     })
 
     // Set headers to force download of CSV file
     res.setHeader('Content-Type', 'text/csv');
     res.setHeader('Content-Disposition', `attachment; filename=${body.fileName}`);
 
     // Send CSV string as response
     res.status(200).send(csv);
   } catch (error) {
    return ResponseHelper.error(error,"File Export failed",HttpStatus.INTERNAL_SERVER_ERROR)
   }
  }
}


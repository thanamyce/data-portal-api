import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
  BadRequestException,
  Body,
  InternalServerErrorException,
  HttpStatus,
  HttpException,
  Req,
  Res,
  Get,
  UseGuards,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { DataService } from './data.service';
import { Express, Request, Response } from 'express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import * as fs from 'fs';

import { ReqUser } from 'src/util/decorate';
import { AuthGuard } from 'src/auth/auth.guard';
import { InjectModel } from '@nestjs/mongoose';
import { Transaction, TransactionDocument } from './transaction.shema';
import { Model } from 'mongoose';
import { ResponseHelper } from 'src/util/ResponseHelper';

@Controller('data')
export class DataController {
  constructor(private readonly dataService: DataService,
    @InjectModel(Transaction.name) private readonly transactionModel: Model<TransactionDocument>
  ) {}

  @Get('getcompanyfield')
  async getCompanyField(){
    return this.dataService.getCompanyFields();
  }
    @Get('getcontactfield')
  async getContactField(){
    return this.dataService.getContactFields();
  }

  @Get('allenum')
  async getAllEnum(){
    return this.dataService.allEnum();
  }

  @Get('getfields')
  async getFields(){
    return this.dataService.formData();
  }

  @Post('upload')
  @UseGuards(AuthGuard)
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: (req, file, cb) => {
          const uploadPath = './uploads';
          if (!fs.existsSync(uploadPath)) {
            fs.mkdirSync(uploadPath, { recursive: true });
          }
          cb(null, uploadPath);
        },
       filename: (req, file, cb) => {
           const uniqueSuffix = Date.now();
           cb(null, uniqueSuffix + '-' + file.originalname);
        },
      }),
      limits: {
        fileSize: 5 * 1024 * 1024,
      },
      fileFilter: (req, file, cb) => {
        if (file.mimetype !== 'text/csv' && !file.originalname.endsWith('.csv')) {
          return cb(new BadRequestException('Only CSV files are allowed'), false);
        }
        cb(null, true);
      },
    }),
  )
  async uploadAndExtractHeaders(@UploadedFile() file: Express.Multer.File, @Req() req: Request) {
    if (!file || !file.path) {
      throw new BadRequestException({
        statusCode: HttpStatus.BAD_REQUEST,
        message: 'File upload failed: No file or invalid file type.',
        error: 'Bad Request',
      });
    }
    try {
      // Save filePath in session
      req.session['filePath'] = file.path;
      req.session['fileName'] = file.filename;

      const result  = await this.dataService.extractHeaders(file.path);

      return {
        statusCode: HttpStatus.OK,
        message: 'CSV headers extracted successfully.',
        data: {
          result
        },
      };
    } catch (error) {
      throw new HttpException(
        {
          statusCode: HttpStatus.BAD_REQUEST,
          message: 'Failed to extract headers from the CSV file.',
          error: error?.message || 'Bad Request',
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }


@Post('datavalidation')
  @UseGuards(AuthGuard)
  async dataValidation(
    @ReqUser() reqUser: any,
    @Req() req: Request,
    @Res() res: Response,
    @Body()
    body: {
      mapping: Record<string, string>;
      requiredCompanyFields: string[];
      semiRequiredCompanyFields: string[];
      requiredContactFields: string[];
      semiRequiredContactFields: string[];
      isCompany: boolean;
      isContact: boolean;
      updateExisting: boolean;
    },
  ) {
    try {
      const filePath = req.session['filePath'];

      if (!filePath || !fs.existsSync(filePath)) {
        throw new BadRequestException({
          statusCode: HttpStatus.BAD_REQUEST,
          message: 'File not found or session expired. Please upload again.',
        });
      }

      const result = await this.dataService.dataValidation(
        filePath,
        body.mapping,
        body.requiredCompanyFields,
        body.semiRequiredCompanyFields,
        body.requiredContactFields,
        body.semiRequiredContactFields,
        body.isCompany,
        body.isContact,
      );

      req.session['reqBody'] = body;
      return res.status(HttpStatus.OK).json(ResponseHelper.success(result, 'Data validation successful', HttpStatus.OK));
    } catch (error) {
      throw new HttpException(
        {
          statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
          message: 'Failed to process CSV data.',
          error: error?.message || 'Internal Server Error',
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
 

  @Post('process')
  @UseGuards(AuthGuard)
  async processMappedCSV(
    @ReqUser() reqUser: any,
    @Req() req: Request,
    @Res() res: Response,
    @Body()
    body: {
      validFieldMapping: any[]
    },
  ) {
    try {
      const filePath = req.session['filePath'];

      if (!filePath || !fs.existsSync(filePath)) {
        throw new BadRequestException({
          statusCode: HttpStatus.BAD_REQUEST,
          message: 'File not found or session expired. Please upload again.',
        });
      }
      const filename = req.session['fileName']
      const reqBody = req.session['reqBody']
      const transaction:any = await this.dataService.createTransaction(reqUser.id,filename);
      const result = await this.dataService.processWithMapping(
        filePath,
        reqBody.mapping,
        reqBody.requiredCompanyFields,
        reqBody.semiRequiredCompanyFields,
        reqBody.requiredContactFields,
        reqBody.semiRequiredContactFields,
        reqBody.isCompany,
        reqBody.isContact,
        reqBody.updateExisting,
        body.validFieldMapping,
        transaction._id
      );
      
      const updatedTransaction = await this.transactionModel.findByIdAndUpdate({_id:transaction._id},{
        $set: {dataSize: result.successCount,
          isSuccessed: true
        }
      },{
        new: true
      })
        req.session.destroy((err)=>{
          if(err){
            console.error("Failed to destroy session")
          }
        })

        res.clearCookie('connect.sid',{
          path: '/',
        httpOnly: true,
        secure: false, // true if using HTTPS
        sameSite: 'lax',
        })
      return res.status(HttpStatus.OK).json({
  statusCode: HttpStatus.OK,
  message: 'CSV processed successfully.',
  data: result,
});
    } catch (error) {
      throw new HttpException(
        {
          statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
          message: 'Failed to process CSV data.',
          error: error?.message || 'Internal Server Error',
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}

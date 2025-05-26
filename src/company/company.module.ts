import { Module } from '@nestjs/common';
import { CompanyService } from './company.service';
import { CompanyController } from './company.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Company, CompanySchema } from './company.schema';

@Module({
  imports:[MongooseModule.forFeature([{ name: Company.name, schema: CompanySchema }])],
  providers: [CompanyService],
  controllers: [CompanyController],
  exports:[CompanyService]
})
export class CompanyModule {}

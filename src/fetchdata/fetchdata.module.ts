import { Module } from '@nestjs/common';
import { FetchdataController } from './fetchdata.controller';
import { FetchdataService } from './fetchdata.service';
import { ContactModule } from 'src/contact/contact.module';
import { MongooseModule } from '@nestjs/mongoose';
import { Contact, ContactSchema } from 'src/contact/contact.schema';
import { Company, CompanySchema } from 'src/company/company.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{name: Contact.name, schema: ContactSchema},{name: Company.name, schema: CompanySchema}]),
    ContactModule],
  controllers: [FetchdataController],
  providers: [FetchdataService]
})
export class FetchdataModule {}

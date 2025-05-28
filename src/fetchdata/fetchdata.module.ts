import { Module } from '@nestjs/common';
import { FetchdataController } from './fetchdata.controller';
import { FetchdataService } from './fetchdata.service';
import { ContactModule } from 'src/contact/contact.module';
import { MongooseModule } from '@nestjs/mongoose';
import { Contact, ContactSchema } from 'src/contact/contact.schema';
import { Company, CompanySchema } from 'src/company/company.schema';
import { AuthModule } from 'src/auth/auth.module';
import { Transaction, TransactionSchema } from 'src/data/transaction.shema';

@Module({
  imports: [
    MongooseModule.forFeature([{name: Contact.name, schema: ContactSchema},{name: Company.name, schema: CompanySchema},{name: Transaction.name, schema: TransactionSchema}]),
    ContactModule,
  AuthModule],
  controllers: [FetchdataController],
  providers: [FetchdataService]
})
export class FetchdataModule {}

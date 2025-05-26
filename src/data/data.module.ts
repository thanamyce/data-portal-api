import { Module } from '@nestjs/common';
import { DataService } from './data.service';
import { DataController } from './data.controller';
import { CompanyModule } from 'src/company/company.module';
import { ContactModule } from 'src/contact/contact.module';
import { TaskModule } from 'src/task/task.module';
import { MongooseModule } from '@nestjs/mongoose';
import { Company, CompanySchema } from 'src/company/company.schema';
import { Contact, ContactSchema } from 'src/contact/contact.schema';
import { Transaction, TransactionSchema } from './transaction.shema';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports:[CompanyModule,ContactModule,TaskModule,AuthModule,
    MongooseModule.forFeature([{ name: Company.name, schema: CompanySchema },{ name: Contact.name, schema: ContactSchema },{name: Transaction.name, schema: TransactionSchema}]),
  ],
  providers: [DataService],
  controllers: [DataController]
})
export class DataModule {}

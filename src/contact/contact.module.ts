import { Module } from '@nestjs/common';
import { ContactService } from './contact.service';
import { ContactController } from './contact.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Contact, ContactSchema } from './contact.schema';
import { Company, CompanySchema } from 'src/company/company.schema';

@Module({
  imports:[MongooseModule.forFeature([{ name: Contact.name, schema: ContactSchema },{name: Company.name, schema: CompanySchema}])],
  providers: [ContactService],
  controllers: [ContactController],
  exports: [ContactModule,ContactService]
})
export class ContactModule {}

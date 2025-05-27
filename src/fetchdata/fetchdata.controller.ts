// src/contacts/contacts.controller.ts
import { Controller, Post, Body } from '@nestjs/common';
import { FetchdataService } from './fetchdata.service';
import { NestedContactFilterDto } from './filter.dto';

@Controller('data')
export class FetchdataController {
  constructor(private readonly contactsService: FetchdataService) {}

  @Post('search')
  async filterContactsByNestedObject(@Body() filterDto: NestedContactFilterDto) {
    return this.contactsService.filterContactsAndCompanies(filterDto);
  }
}


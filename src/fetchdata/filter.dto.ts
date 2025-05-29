// src/contacts/dto/nested-filter.dto.ts
export class NestedContactFilterDto {
  filter:{
 contact?: Record<string, any>;
  company?: Record<string, any>;
   exclude?: {
    contact?: Record<string, any>;       
    company?: Record<string, any>;       
  };
  }
 
  page?:number;
  limit?:number;
  fields?:string[];
}

export class ExportContactDto {
  filter:{
  contact?: Record<string, any>;
  company?: Record<string, any>;
   exclude?: {
    contact?: Record<string, any>;       
    company?: Record<string, any>;       
  };
  }
  fileName?:string;
  fields?:string[];
}


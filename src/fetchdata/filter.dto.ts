// src/contacts/dto/nested-filter.dto.ts
export class NestedContactFilterDto {
  contact?: Record<string, any>;
  company?: Record<string, any>;
   exclude?: {
    contact?: Record<string, any>;       
    company?: Record<string, any>;       
  };
}

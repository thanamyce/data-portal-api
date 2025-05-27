import { Test, TestingModule } from '@nestjs/testing';
import { FetchdataService } from './fetchdata.service';

describe('FetchdataService', () => {
  let service: FetchdataService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [FetchdataService],
    }).compile();

    service = module.get<FetchdataService>(FetchdataService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});

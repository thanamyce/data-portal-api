import { Test, TestingModule } from '@nestjs/testing';
import { FetchdataController } from './fetchdata.controller';

describe('FetchdataController', () => {
  let controller: FetchdataController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FetchdataController],
    }).compile();

    controller = module.get<FetchdataController>(FetchdataController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});

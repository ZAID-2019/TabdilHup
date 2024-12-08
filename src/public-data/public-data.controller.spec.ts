import { Test, TestingModule } from '@nestjs/testing';
import { PublicDataController } from './public-data.controller';

describe('PublicDataController', () => {
  let controller: PublicDataController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PublicDataController],
    }).compile();

    controller = module.get<PublicDataController>(PublicDataController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});

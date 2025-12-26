import { Test, TestingModule } from '@nestjs/testing';
import { CarrierController } from './carrier.controller';

describe('CarrierController', () => {
  let controller: CarrierController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CarrierController],
    }).compile();

    controller = module.get<CarrierController>(CarrierController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});

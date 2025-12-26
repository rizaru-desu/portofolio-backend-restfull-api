import { Test, TestingModule } from '@nestjs/testing';
import { TestimoniController } from './testimoni.controller';

describe('TestimoniController', () => {
  let controller: TestimoniController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TestimoniController],
    }).compile();

    controller = module.get<TestimoniController>(TestimoniController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});

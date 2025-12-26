import { Test, TestingModule } from '@nestjs/testing';
import { PortofolioController } from './portofolio.controller';

describe('PortofolioController', () => {
  let controller: PortofolioController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PortofolioController],
    }).compile();

    controller = module.get<PortofolioController>(PortofolioController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});

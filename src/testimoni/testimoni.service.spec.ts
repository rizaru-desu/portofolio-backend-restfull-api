import { Test, TestingModule } from '@nestjs/testing';
import { TestimoniService } from './testimoni.service';

describe('TestimoniService', () => {
  let service: TestimoniService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TestimoniService],
    }).compile();

    service = module.get<TestimoniService>(TestimoniService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});

import { Test, TestingModule } from '@nestjs/testing';
import { TimeOutService } from './time-out.service';
import { PrismaService } from '@/prisma/prisma.service';

describe('TimeOutService', () => {
  let service: TimeOutService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TimeOutService, PrismaService],
    }).compile();

    service = module.get<TimeOutService>(TimeOutService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});

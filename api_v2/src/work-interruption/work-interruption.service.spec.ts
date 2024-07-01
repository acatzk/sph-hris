import { Test, TestingModule } from '@nestjs/testing';
import { WorkInterruptionService } from './work-interruption.service';
import { PrismaService } from '@/prisma/prisma.service';

describe('WorkInterruptionService', () => {
  let service: WorkInterruptionService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [WorkInterruptionService, PrismaService],
    }).compile();

    service = module.get<WorkInterruptionService>(WorkInterruptionService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});

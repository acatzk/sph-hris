import { Test, TestingModule } from '@nestjs/testing';
import { TimeRecordService } from './time-record.service';
import { PrismaService } from '@/prisma/prisma.service';
import { TimeRecordResolver } from './time-record.resolver';

describe('TimeRecordService', () => {
  let service: TimeRecordService;
  const mockPrismaService = {};

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TimeRecordService, PrismaService, TimeRecordResolver],
    }).overrideProvider(PrismaService).useValue(mockPrismaService).compile();

    service = module.get<TimeRecordService>(TimeRecordService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});

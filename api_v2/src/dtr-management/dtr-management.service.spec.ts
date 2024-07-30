import { Test, TestingModule } from '@nestjs/testing';
import { DtrManagementService } from './dtr-management.service';
import { PrismaService } from '@/prisma/prisma.service';

describe('DtrManagementService', () => {
  let service: DtrManagementService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DtrManagementService, PrismaService],
    }).compile();

    service = module.get<DtrManagementService>(DtrManagementService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});

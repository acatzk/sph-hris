import { Test, TestingModule } from '@nestjs/testing';
import { DtrManagementResolver } from './dtr-management.resolver';
import { DtrManagementService } from './dtr-management.service';
import { PrismaService } from '@/prisma/prisma.service';

describe('DtrManagementResolver', () => {
  let resolver: DtrManagementResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DtrManagementResolver, DtrManagementService, PrismaService],
    }).compile();

    resolver = module.get<DtrManagementResolver>(DtrManagementResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});

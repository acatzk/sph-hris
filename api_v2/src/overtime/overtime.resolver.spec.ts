import { Test, TestingModule } from '@nestjs/testing';
import { OvertimeResolver } from './overtime.resolver';
import { OvertimeService } from './overtime.service';
import { PrismaService } from '@/prisma/prisma.service';

describe('OvertimeResolver', () => {
  let resolver: OvertimeResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [OvertimeResolver, OvertimeService, PrismaService],
    }).compile();

    resolver = module.get<OvertimeResolver>(OvertimeResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});

import { Test, TestingModule } from '@nestjs/testing';
import { OvertimeService } from './overtime.service';
import { PrismaService } from '@/prisma/prisma.service';

describe('OvertimeService', () => {
  let service: OvertimeService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [OvertimeService, PrismaService],
    }).compile();

    service = module.get<OvertimeService>(OvertimeService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});

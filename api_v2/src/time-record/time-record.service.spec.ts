import { Test, TestingModule } from '@nestjs/testing';
import { TimeRecordService } from './time-record.service';
import { PrismaService } from '@/prisma/prisma.service';
import { TimeRecordResolver } from './time-record.resolver';

describe('TimeRecordService', () => {
  let service: TimeRecordService;
  let prismaService: PrismaService;

  const mockPrismaService = {
    user: {
      findUnique: jest.fn(),
    },
    timeEntry: {
      findMany: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TimeRecordService, TimeRecordResolver, {provide: PrismaService, useValue: mockPrismaService}],
    }).overrideProvider(PrismaService).useValue(mockPrismaService).compile();

    service = module.get<TimeRecordService>(TimeRecordService);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getUserById', () => {
    it('should return an object of user information', async () => {
      const result = {
        id: 1,
        name: "Abdul Jalil Palala",
        email: "abduljalil.palala@sun-asterisk.com",
        overtimes: new Array,
      };

      (jest.spyOn(prismaService.user, 'findUnique') as jest.Mock).mockResolvedValue(result);

      expect(await service.getUserById(1)).toEqual(result);
    });
  });

  describe('getTimeEntriesById', () => {
    it('should return an array of time entries', async () => {
      const queryResult = [{
        id: 1,
        workedHours: "08:00",
        startTime: new Date,
        endTime: new Date,
        eslChangeShiftRequests: [],
      }];

      (jest.spyOn(prismaService.timeEntry, 'findMany') as jest.Mock).mockResolvedValue(queryResult);

      const result = {
        id: 1,
        workedHours: "08:00",
      };

      expect(await service.getTimeEntriesById(1)).toEqual(
        expect.arrayContaining([
          expect.objectContaining(result)
        ])
      );
    });
  });
});

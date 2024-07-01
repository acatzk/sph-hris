import { Test, TestingModule } from '@nestjs/testing';
import { InterruptionService } from './view-work-interruption.service';
import { PrismaService } from '@/prisma/prisma.service';
import { ShowInterruptionRequestInput } from '@/graphql/graphql';
import { DateTime } from 'luxon';

describe('InterruptionService', () => {
  let service: InterruptionService;

  const mockPrismaService = {
    workInterruption: {
      findMany: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        InterruptionService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    service = module.get<InterruptionService>(InterruptionService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('interruptionsByTimeEntryId', () => {
    it('should return a list of WorkInterruptionDTO', async () => {
      const interruptionInput: ShowInterruptionRequestInput = {
        timeEntryId: 1,
      };
      const prismaResponse = [
        {
          id: '1',
          timeOut: new Date('2023-01-01T12:00:00Z'),
          timeIn: new Date('2023-01-01T13:00:00Z'),
          workInterruptionTypeId: '1',
          timeEntryId: '1',
          otherReason: 'Reason',
          remarks: 'Remarks',
          workInterruptionType: {
            id: '1',
            name: 'Type 1',
            createdAt: new Date('2023-01-01T00:00:00Z'),
            updatedAt: new Date('2023-01-02T00:00:00Z'),
            workInterruption: [],
          },
          createdAt: new Date('2023-01-01T00:00:00Z'),
        },
      ];

      mockPrismaService.workInterruption.findMany.mockResolvedValue(
        prismaResponse,
      );

      const result =
        await service.interruptionsByTimeEntryId(interruptionInput);
      expect(result).toEqual([
        {
          id: '1',
          timeOut: '12:00:00',
          timeIn: '13:00:00',
          workInterruptionTypeId: '1',
          timeEntryId: '1',
          otherReason: 'Reason',
          remarks: 'Remarks',
          workInterruptionType: {
            id: '1',
            name: 'Type 1',
            workInterruption: [],
            createdAt: DateTime.fromJSDate(new Date('2023-01-01T00:00:00Z')),
            updatedAt: DateTime.fromJSDate(new Date('2023-01-02T00:00:00Z')),
          },
          createdAt: '2023-01-01T00:00:00.000Z',
        },
      ]);
    });
  });

  describe('mapWorkInterruptionType', () => {
    it('should map the WorkInterruptionType correctly', () => {
      const type: any = {
        id: '1',
        name: 'Type 1',
        createdAt: new Date('2023-01-01T00:00:00Z'),
        updatedAt: new Date('2023-01-02T00:00:00Z'),
        workInterruption: [],
      };

      const result = service['mapWorkInterruptionType'](type);
      expect(result).toEqual({
        id: '1',
        name: 'Type 1',
        workInterruption: [],
        createdAt: DateTime.fromJSDate(new Date('2023-01-01T00:00:00Z')),
        updatedAt: DateTime.fromJSDate(new Date('2023-01-02T00:00:00Z')),
      });
    });

    it('should return null if no type is provided', () => {
      const result = service['mapWorkInterruptionType'](null);
      expect(result).toBeNull();
    });
  });
});

import { Test, TestingModule } from '@nestjs/testing';
import { WorkInterruptionResolver } from './work-interruption.resolver';
import { WorkInterruptionService } from './work-interruption.service';
import {
  CreateInterruptionRequestInput,
  WorkInterruptionDTO,
  ShowInterruptionRequestInput,
} from '@/graphql/graphql';

describe('WorkInterruptionResolver', () => {
  let resolver: WorkInterruptionResolver;
  let service: WorkInterruptionService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        WorkInterruptionResolver,
        {
          provide: WorkInterruptionService,
          useValue: {
            create: jest.fn(),
            interruptionsByTimeEntryId: jest.fn(),
          },
        },
      ],
    }).compile();

    resolver = module.get<WorkInterruptionResolver>(WorkInterruptionResolver);
    service = module.get<WorkInterruptionService>(WorkInterruptionService);
  });

  describe('createWorkInterruption', () => {
    it('should call the service to create a work interruption', async () => {
      const input: CreateInterruptionRequestInput = {
        timeEntryId: 1,
        workInterruptionTypeId: 1,
        otherReason: 'test reason',
        timeOut: '18:30:00',
        timeIn: '09:30:00',
        remarks: 'test remarks',
      };

      const mockResult = { id: 1 };
      (service.create as jest.Mock).mockResolvedValue(mockResult);

      const result = await resolver.create(input);
      expect(result).toEqual(mockResult);
      expect(service.create).toHaveBeenCalledWith(input);
    });
  });

  describe('interruptionsByTimeEntryId', () => {
    it('should call the service to get work interruptions by time entry ID', async () => {
      const input: ShowInterruptionRequestInput = { timeEntryId: 1 };
      const mockInterruptions: WorkInterruptionDTO[] = [
        {
          id: 1,
          timeOut: '12:00:00',
          timeIn: '13:00:00',
          workInterruptionTypeId: 1,
          timeEntryId: 1,
          otherReason: 'test reason',
          remarks: 'test remarks',
          workInterruptionType: {
            id: 1,
            name: 'test type',
            workInterruption: [],
            createdAt: new Date(),
            updatedAt: new Date(),
          },
          createdAt: new Date().toISOString(),
        },
      ];

      (service.interruptionsByTimeEntryId as jest.Mock).mockResolvedValue(
        mockInterruptions,
      );

      const result = await resolver.interruptionsByTimeEntryId(input);
      expect(result).toEqual(mockInterruptions);
      expect(service.interruptionsByTimeEntryId).toHaveBeenCalledWith(input);
    });
  });
});

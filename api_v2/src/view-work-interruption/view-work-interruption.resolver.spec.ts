import { Test, TestingModule } from '@nestjs/testing';
import { InterruptionResolver } from './view-work-interruption.resolver';
import { InterruptionService } from './view-work-interruption.service';
import {
  ShowInterruptionRequestInput,
  WorkInterruptionDTO,
} from '@/graphql/graphql';

describe('InterruptionResolver', () => {
  let resolver: InterruptionResolver;
  let service: InterruptionService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        InterruptionResolver,
        {
          provide: InterruptionService,
          useValue: {
            interruptionsByTimeEntryId: jest.fn(),
          },
        },
      ],
    }).compile();

    resolver = module.get<InterruptionResolver>(InterruptionResolver);
    service = module.get<InterruptionService>(InterruptionService);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });

  describe('interruptionsByTimeEntryId', () => {
    it('should return an array of WorkInterruptionDTO', async () => {
      const input: ShowInterruptionRequestInput = {
        timeEntryId: 1234,
      };
      const expectedResult: WorkInterruptionDTO[] = [];

      jest
        .spyOn(service, 'interruptionsByTimeEntryId')
        .mockResolvedValue(expectedResult);

      const result = await resolver.interruptionsByTimeEntryId(input);
      expect(result).toEqual(expectedResult);
    });
  });
});

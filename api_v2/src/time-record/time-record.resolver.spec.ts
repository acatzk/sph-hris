import { Test, TestingModule } from '@nestjs/testing';
import { TimeRecordResolver } from './time-record.resolver';
import { TimeRecordService } from './time-record.service';

describe('TimeRecordResolver', () => {
  let resolver: TimeRecordResolver;
  let mockTimeRecordService = {
    getUserById: jest.fn().mockResolvedValue({id: 1, name: 'Abdul Jalil Palala'}),
    getTimeEntriesById: jest.fn().mockResolvedValue({startTime: "09:30:00"}),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TimeRecordResolver, {
        provide: TimeRecordService,
        useValue: mockTimeRecordService
      }],
    }).compile();

    resolver = module.get<TimeRecordResolver>(TimeRecordResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });

  describe('userById', () => {
    it('should call the service to get user', async () => {
      const result = await resolver.userById(1);

      expect(result).toEqual({id: 1, name: 'Abdul Jalil Palala'});
    });
  });

  describe('timeEntriesByEmployeeId', () => {
    it('should call the service to get time entries', async () => {
      const result = await resolver.timeEntriesByEmployeeId(1);

      expect(result).toEqual({startTime: "09:30:00"});
    });
  });
});

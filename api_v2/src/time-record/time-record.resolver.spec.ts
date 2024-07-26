import { Test, TestingModule } from '@nestjs/testing';
import { TimeRecordResolver } from './time-record.resolver';
import { TimeRecordService } from './time-record.service';

describe('TimeRecordResolver', () => {
  let resolver: TimeRecordResolver;
  const mockTimeRecordService = {
    getTimeEntriesById  : jest.fn()
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TimeRecordResolver, TimeRecordService],
    })
    .overrideProvider(TimeRecordService)
    .useValue(mockTimeRecordService)
    .compile();

    resolver = module.get<TimeRecordResolver>(TimeRecordResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});

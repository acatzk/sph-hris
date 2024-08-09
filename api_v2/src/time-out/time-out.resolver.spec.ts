import { Test, TestingModule } from '@nestjs/testing';
import { TimeOutMutation } from './time-out.resolver';
import { TimeOutService } from './time-out.service';
import { TimeOutRequestInput } from '@/graphql/graphql';

describe('TimeOutMutation', () => {
  let timeOutMutation: TimeOutMutation;
  let timeOutService: TimeOutService;

  const mockTimeOutService = {
    update: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TimeOutMutation,
        { provide: TimeOutService, useValue: mockTimeOutService },
      ],
    }).compile();

    timeOutMutation = module.get<TimeOutMutation>(TimeOutMutation);
    timeOutService = module.get<TimeOutService>(TimeOutService);
  });

  it('should be defined', () => {
    expect(timeOutMutation).toBeDefined();
  });

  describe('updateTimeOut', () => {
    it('should return a success message when update is successful', async () => {
      const timeOutInput: TimeOutRequestInput = {
        userId: 0,
        timeHour: undefined,
      };

      mockTimeOutService.update.mockResolvedValue(
        'TimeOut updated successfully.',
      );

      const result = await timeOutMutation.updateTimeOut(timeOutInput);

      expect(result).toEqual('TimeOut updated successfully.');
      expect(timeOutService.update).toHaveBeenCalledWith(timeOutInput);
    });

    it('should throw an error when update fails', async () => {
      const timeOutInput: TimeOutRequestInput = {
        userId: 0,
        timeHour: undefined,
      };

      mockTimeOutService.update.mockRejectedValue(new Error('Update failed'));

      await expect(timeOutMutation.updateTimeOut(timeOutInput)).rejects.toThrow(
        'Update failed',
      );
      expect(timeOutService.update).toHaveBeenCalledWith(timeOutInput);
    });
  });
});

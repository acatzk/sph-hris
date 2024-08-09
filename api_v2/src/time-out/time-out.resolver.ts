import { Resolver, Mutation, Args } from '@nestjs/graphql';
import { TimeOutService } from './time-out.service';
import { TimeOutRequestInput } from '@/graphql/graphql';

@Resolver()
export class TimeOutMutation {
  constructor(private readonly timeOutService: TimeOutService) {}

  @Mutation(() => String)
  async updateTimeOut(
    @Args('timeOut') timeOut: TimeOutRequestInput,
  ): Promise<string> {
    try {
      return await this.timeOutService.update(timeOut);
    } catch (e) {
      throw new Error(e.message);
    }
  }
}

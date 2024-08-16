import { Args, Query, Resolver } from '@nestjs/graphql';
import { OvertimeService } from './overtime.service';
import { OvertimeDTO } from '@/graphql/graphql';

@Resolver('Overtime')
export class OvertimeResolver {
  constructor(private readonly overtimeService: OvertimeService) {}
  // Query to get all overtime entries
  @Query(() => [OvertimeDTO])
  async allOvertime() {
    return await this.overtimeService.getAllOvertime();
  }

  // Query to get overtime by user ID
  @Query()
  async overtime(@Args('userId') userId: number) {
    return await this.overtimeService.getOvertimeByUser(userId);
  }
}

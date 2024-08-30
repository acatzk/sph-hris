import { Query, Resolver } from '@nestjs/graphql';
import { LeavesService } from './leaves.service';
import { LeaveDTO } from '@/graphql/graphql';

@Resolver('Leave')
export class LeavesResolver {
  constructor(private readonly leavesService: LeavesService) {}

  @Query(() => [LeaveDTO])
  async allLeaves() {
    return await this.leavesService.allLeaves();
  }
}

import { Resolver, Query } from '@nestjs/graphql';
import { DtrManagementService } from './dtr-management.service';
import { TimeEntryDTO } from '@/graphql/graphql';

@Resolver(() => TimeEntryDTO)
export class DtrManagementResolver {
  constructor(private readonly dtrManagementService: DtrManagementService) {}

  @Query(() => [TimeEntryDTO])
  async timeEntries() {
    return this.dtrManagementService.timeEntries();
  }
}

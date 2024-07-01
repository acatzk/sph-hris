import { Resolver, Query, Args } from '@nestjs/graphql';
import { InterruptionService } from './view-work-interruption.service';
import {
  ShowInterruptionRequestInput,
  WorkInterruptionDTO,
} from '@/graphql/graphql';

@Resolver('Interruption')
export class InterruptionResolver {
  constructor(private readonly interruptionService: InterruptionService) {}
  /**
   * Handles the viewInterruption mutation request.
   *
   * @param {ShowInterruptionRequestInput} interruption - The input for fetching interruptions.
   * @returns {Promise<WorkInterruptionDTO[]>} The list of work interruptions.
   */
  @Query(() => [WorkInterruptionDTO])
  async interruptionsByTimeEntryId(
    @Args('interruption') interruption: ShowInterruptionRequestInput,
  ): Promise<WorkInterruptionDTO[]> {
    return this.interruptionService.interruptionsByTimeEntryId(interruption);
  }
}

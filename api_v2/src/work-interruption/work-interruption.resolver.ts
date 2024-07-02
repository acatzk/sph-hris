import { Resolver, Mutation, Args, Query } from '@nestjs/graphql';
import { WorkInterruptionService } from './work-interruption.service';
import {
  CreateInterruptionRequestInput,
  WorkInterruptionDTO,
  ShowInterruptionRequestInput,
} from '@/graphql/graphql';

@Resolver('WorkInterruption')
export class WorkInterruptionResolver {
  constructor(
    private readonly workInterruptionService: WorkInterruptionService,
  ) {}

  /**
   *Handle Creating a new work interruption
   *
   *
   * @param {CreateInterruptionRequestInput} interruption this input require TimeEntryId and
   * WorkInterruptionTypeId
   *
   * @returns the Id of the new work interruption
   */
  @Mutation('createWorkInterruption')
  create(@Args('interruption') interruption: CreateInterruptionRequestInput) {
    return this.workInterruptionService.create(interruption);
  }
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
    return this.workInterruptionService.interruptionsByTimeEntryId(
      interruption,
    );
  }
}

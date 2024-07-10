import { Resolver, Mutation, Args, Query, Int } from '@nestjs/graphql';
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
  /**
   * GraphQL Mutation: Deletes a WorkInterruption record from the database.
   * @param {number} id - The ID of the WorkInterruption to delete.
   * @returns {Promise<boolean>} A boolean indicating whether the deletion was successful.
   */
  @Mutation(() => Boolean)
  async deleteWorkInterruption(
    @Args('id', { type: () => Int }) id: number,
  ): Promise<boolean> {
    try {
      const deleted =
        await this.workInterruptionService.deleteWorkInterruption(id);
      return !!deleted;
    } catch (error) {
      throw error;
    }
  }
}

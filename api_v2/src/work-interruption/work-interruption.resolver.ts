import { Resolver, Mutation, Args, Query, Int } from '@nestjs/graphql';
import { WorkInterruptionService } from './work-interruption.service';
import {
  WorkInterruptionDTO,
  ShowInterruptionRequestInput,
} from '@/graphql/graphql';
import {
  CreateInterruptionRequestInput,
  UpdateInterruptionRequestInput,
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
   * Mutation resolver to update an existing work interruption record.
   * @param {UpdateInterruptionRequestInput} interruption - The data to update for the interruption.
   * @returns {Promise<boolean>} Returns true if the interruption was successfully updated, false otherwise.
   */
  @Mutation(() => Boolean)
  async updateWorkInterruption(
    @Args('interruption') interruption: UpdateInterruptionRequestInput,
  ): Promise<boolean> {
    try {
      const updateSuccessful =
        await this.workInterruptionService.updateInterruption(interruption);
      return updateSuccessful;
    } catch (error) {
      console.error(`Error updating work interruption`);
      return false;
    }
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

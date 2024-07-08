import { Resolver, Mutation, Args } from '@nestjs/graphql';
import { WorkInterruptionService } from './work-interruption.service';
import { CreateInterruptionRequestInput } from '@/graphql/graphql';

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
}

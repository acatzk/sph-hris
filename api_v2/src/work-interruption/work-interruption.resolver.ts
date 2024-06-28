import { Resolver, Mutation, Args } from '@nestjs/graphql';
import { WorkInterruptionService } from './work-interruption.service';
import { CreateInterruptionRequestInput } from '@/graphql/graphql';

@Resolver('WorkInterruption')
export class WorkInterruptionResolver {
  constructor(private readonly workInterruptionService: WorkInterruptionService) {}

  @Mutation('createWorkInterruption')
  create(@Args('interruption') interruption: CreateInterruptionRequestInput) {
    return this.workInterruptionService.create(interruption);
  }
}

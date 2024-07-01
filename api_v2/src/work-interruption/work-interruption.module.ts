import { Module } from '@nestjs/common';
import { WorkInterruptionService } from './work-interruption.service';
import { WorkInterruptionResolver } from './work-interruption.resolver';
import { PrismaService } from '@/prisma/prisma.service';

@Module({
  providers: [WorkInterruptionResolver, WorkInterruptionService, PrismaService],
})
export class WorkInterruptionModule {}

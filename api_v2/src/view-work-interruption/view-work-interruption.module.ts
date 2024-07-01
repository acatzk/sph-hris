import { Module } from '@nestjs/common';
import { InterruptionResolver } from './view-work-interruption.resolver';
import { InterruptionService } from './view-work-interruption.service';
import { PrismaService } from '@/prisma/prisma.service';

@Module({
  providers: [InterruptionResolver, InterruptionService, PrismaService],
})
export class ViewWorkInterruptionModule {}

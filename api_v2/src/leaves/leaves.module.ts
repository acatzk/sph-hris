import { Module } from '@nestjs/common';
import { LeavesService } from './leaves.service';
import { LeavesResolver } from './leaves.resolver';
import { PrismaService } from '@/prisma/prisma.service';

@Module({
  providers: [LeavesResolver, LeavesService, PrismaService],
})
export class LeavesModule {}

import { Module } from '@nestjs/common';
import { DtrManagementService } from './dtr-management.service';
import { DtrManagementResolver } from './dtr-management.resolver';
import { PrismaService } from '@/prisma/prisma.service';

@Module({
  providers: [DtrManagementResolver, DtrManagementService, PrismaService],
})
export class DtrManagementModule {}

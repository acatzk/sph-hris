import { Module } from '@nestjs/common';
import { OvertimeService } from './overtime.service';
import { OvertimeResolver } from './overtime.resolver';
import { PrismaService } from '@/prisma/prisma.service';

@Module({
  providers: [OvertimeResolver, OvertimeService, PrismaService],
})
export class OvertimeModule {}

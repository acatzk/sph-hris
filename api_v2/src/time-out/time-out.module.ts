import { Module } from '@nestjs/common';
import { TimeOutService } from './time-out.service';
import { TimeOutMutation } from './time-out.resolver';
import { PrismaService } from '@/prisma/prisma.service';

@Module({
  providers: [TimeOutMutation, TimeOutService, PrismaService],
})
export class TimeOutModule {}

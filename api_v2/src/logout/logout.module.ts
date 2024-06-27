import { Module } from '@nestjs/common';
import { LogoutService } from './logout.service';
import { LogoutResolver } from './logout.resolver';
import { PrismaService } from '@/prisma/prisma.service';

@Module({
  providers: [LogoutResolver, LogoutService, PrismaService],
})
export class LogoutModule {}

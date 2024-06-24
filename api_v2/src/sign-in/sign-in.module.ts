import { Module } from '@nestjs/common';
import { SignInService } from './sign-in.service';
import { SignInResolver } from './sign-in.resolver';
import { HttpModule } from '@nestjs/axios';
import { AccessTokenGuard } from '@/guards/access-token.guard';
import { PrismaService } from '@/prisma/prisma.service';

@Module({
  imports: [
    HttpModule.registerAsync({
      useFactory: () => ({
        timeout: 5000,
        maxRedirects: 5,
      }),
    }),
  ],
  providers: [SignInResolver, SignInService, AccessTokenGuard, PrismaService],
})
export class SignInModule {}

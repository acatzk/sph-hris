import { Module } from '@nestjs/common';
import { HrisApiService } from './hris-api.service';
import { HttpModule } from '@nestjs/axios';
import { AuthTokenModule } from '@/auth-token/auth-token.module';

@Module({
  imports: [
    HttpModule.registerAsync({
      useFactory: () => ({
        timeout: 5000,
        maxRedirects: 5,
      }),
    }),
    AuthTokenModule,
  ],
  providers: [HrisApiService],
  exports: [HrisApiService],
})
export class HrisApiModule {}

import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import jwtConfig from 'config/jwt.config';
import { JwtModule } from '@nestjs/jwt';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { join } from 'path';
import { AppResolver } from './app.resolver';
import { ScheduleModule } from '@nestjs/schedule';
import { TaskModule } from './task/task.module';
import { SlackModule } from './slack/slack.module';
import { HrisApiModule } from './hris-api/hris-api.module';
import { AuthTokenModule } from './auth-token/auth-token.module';
import slackConfig from 'config/slack.config';
import { CacheModule } from '@nestjs/cache-manager';
import hrisApiConfig from 'config/hris-api.config';
import { BullModule } from '@nestjs/bull';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [jwtConfig, slackConfig, hrisApiConfig],
    }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      global: true,
      useFactory: (configService: ConfigService) => ({
        secret: configService.get('jwtSecret'),
        signOptions: {
          expiresIn: configService.get('jwtSigningExpiration'),
          algorithm: configService.get('jwtSigningAlgorithm'),
        },
      }),
      inject: [ConfigService],
    }),
    GraphQLModule.forRootAsync<ApolloDriverConfig>({
      driver: ApolloDriver,
      useFactory: () => ({
        autoSchemaFile: join(process.cwd(), 'src/graphql/schema.gql'),
      }),
    }),
    ScheduleModule.forRoot(),
    CacheModule.registerAsync({
      imports: [ConfigModule],
      isGlobal: true,
      useFactory: (configService: ConfigService) => ({
        ttl: configService.get('cacheTTL'),
      }),
      inject: [ConfigService],
    }),
    BullModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        redis: {
          host: configService.get('queueHost'),
          port: configService.get('queuePort'),
        },
      }),
      inject: [ConfigService],
    }),
    TaskModule,
    SlackModule,
    HrisApiModule,
    AuthTokenModule,
  ],
  controllers: [AppController],
  providers: [AppService, AppResolver],
})
export class AppModule {}

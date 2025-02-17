import { InfraModule } from './infra/infra.module';
import { DomainModule } from './domain/domain.module';
import { CacheModule } from '@nestjs/cache-manager';
import { Module } from '@nestjs/common';
import { redisStore } from 'cache-manager-redis-yet';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    InfraModule,
    DomainModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    CacheModule.registerAsync({
      isGlobal: true,
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => {
        return {
          store: redisStore as any,
          url: process.env.REDIS_URL,
          ttl: 120,
        };
      },
    }),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}

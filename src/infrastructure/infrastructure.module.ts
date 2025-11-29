import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { RedisModule } from '@nestjs-modules/ioredis';
import { ThrottlerModule } from '@nestjs/throttler';
import { ThrottlerStorageRedisService } from '@nest-lab/throttler-storage-redis';
import { DatabaseModule } from './database/database.module';
import { ConfigurationModule } from './configuration/configuration.module';
import { MailModule } from './mail/mail.module';
import { LocalizationModule } from './localization/localization.module';
import { LoggerModule } from './logger/logger.module';
import { IEnvironmentConfiguration } from './configuration/interfaces/config.interface';
import { IRedisConfiguration } from './configuration/interfaces/sub-interfaces/redis.interface';
import { TRANSLATION_SERVICE } from 'src/modules/shared/application/constant/translation-service.constant';
import { ITranslationService } from 'src/modules/shared/application/interfaces/translation-service.interface';
import { RateLimiterConfiguration } from './configuration/interfaces/sub-interfaces/rate-limiter-configuration.interface';
import { RedisConnectorService } from 'src/modules/shared/infrastructure/cache/services/redis-connector.service';

@Module({
  imports: [
    JwtModule.register({
      global: true,
    }),
    RedisModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService<IEnvironmentConfiguration>) => {
        const options = configService.get<IRedisConfiguration>('redis');
        return {
          type: 'single',
          options: {
            ...options,
            maxRetriesPerRequest: null,
          },
        }
      }
    }),
    // ThrottlerModule.forRootAsync({
    //   inject: [ConfigService, RedisConnectorService, TRANSLATION_SERVICE],
    //   useFactory(configService: ConfigService<IEnvironmentConfiguration, true>, redisConnectorService: RedisConnectorService, translationService: ITranslationService) {
    //     const { limit, ttl } = configService.get<RateLimiterConfiguration>('rateLimiter').default;
    //     return {
    //       throttlers: [
    //         {
    //           limit,
    //           ttl,
    //         },
    //       ],
    //       storage: new ThrottlerStorageRedisService(redisConnectorService.connection),
    //       errorMessage(_context, throttlerLimitDetail) {
    //         return translationService.translate('errors.global.rate_limiter.too_many_requests', {
    //           ttl: throttlerLimitDetail.ttl / 1000,
    //         });
    //       },
    //     };
    //   },
    // }),
    ConfigurationModule,
    DatabaseModule,
    MailModule,
    LocalizationModule,
    LoggerModule,
  ],
})
export class InfrastructureModule {}

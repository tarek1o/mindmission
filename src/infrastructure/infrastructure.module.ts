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
import { GraphqlExceptionFilter } from './exception-filters/graphql/graphql-exception.filter';
import { AllRestfulExceptionFilter } from './exception-filters/rest/all-restful-exception.filter';
import { AllGraphqlExceptionFilter } from './exception-filters/graphql/all-graphql-exception.filter';
import { DomainRestfulExceptionFilter } from './exception-filters/rest/domain-restful-exception.filter';
import { DomainGraphqlExceptionFilter } from './exception-filters/graphql/domain-graphql-exception.filter';
import { RestfulExceptionFilter } from './exception-filters/rest/restful-exception.filter';
import { I18nValidationRestfulExceptionFilter } from './exception-filters/rest/i18n-validation-restful-exception.filter';
import { I18nValidationGraphqlExceptionFilter } from './exception-filters/graphql/i18n-validation-graphql-exception.filter';

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
        };
      },
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
  providers: [
    {
      provide: AllRestfulExceptionFilter.name,
      useClass: AllRestfulExceptionFilter,
    },
    {
      provide: AllGraphqlExceptionFilter.name,
      useClass: AllGraphqlExceptionFilter,
    },
    {
      provide: DomainRestfulExceptionFilter.name,
      useClass: DomainRestfulExceptionFilter,
    },
    {
      provide: DomainGraphqlExceptionFilter.name,
      useClass: DomainGraphqlExceptionFilter,
    },
    {
      provide: RestfulExceptionFilter.name,
      useClass: RestfulExceptionFilter,
    },
    {
      provide: GraphqlExceptionFilter.name,
      useClass: GraphqlExceptionFilter,
    },
    {
      provide: I18nValidationRestfulExceptionFilter.name,
      useClass: I18nValidationRestfulExceptionFilter,
    },
    {
      provide: I18nValidationGraphqlExceptionFilter.name,
      useClass: I18nValidationGraphqlExceptionFilter,
    },
  ],
})
export class InfrastructureModule {}

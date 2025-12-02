import { join } from 'path';
import { Module, ClassSerializerInterceptor, MiddlewareConsumer, NestModule } from '@nestjs/common';
import { APP_FILTER, APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { ApolloServerPluginLandingPageLocalDefault } from '@apollo/server/plugin/landingPage/default';
import { ThrottlerGuard } from '@nestjs/throttler';
import { BullModule } from '@nestjs/bullmq';
import { DomainHeadersMiddleware } from './infrastructure/middlewares/domain-headers.middleware';
import { InfrastructureModule } from './infrastructure/infrastructure.module';
import { SharedModule } from './modules/shared/shared.module';
import { NotificationModule } from './modules/notification/notification.module';
import { StorageModule } from './modules/storage/storage.module';
import { PermissionModule } from './modules/permission/permission.module';
import { RoleModule } from './modules/role/role.module';
import { UserModule } from './modules/user/user.module';
import { AuthModule } from './modules/auth/auth.module';
import { SuspendedAccountModule } from './modules/suspended-account/suspended-account.module';
import { ActionTokenModule } from './modules/action-token/action-token.module';
import { ResponseWrapperInterceptor } from './infrastructure/interceptors/response-wrapper.interceptor';
import { RedisConnectorService } from './modules/shared/infrastructure/cache/services/redis-connector.service';
import { CategoryModule } from './modules/category/category.module';
import { IEnvironmentConfiguration } from './infrastructure/configuration/interfaces/config.interface';
import { AppConfigInterface } from './infrastructure/configuration/interfaces/sub-interfaces/app-config.interface';
import { AllExceptionFilter } from './infrastructure/exception-filters/all-exception.filter';
import { DomainExceptionFilter } from './infrastructure/exception-filters/domain-exception.filter';
import { MainExceptionFilter } from './infrastructure/exception-filters/main-exception.filter';
import { I18nValidationExceptionFilter } from './infrastructure/exception-filters/i18n-validation-exception.filter';
@Module({
  imports: [
    GraphQLModule.forRootAsync<ApolloDriverConfig>({
      driver: ApolloDriver,
      inject: [ConfigService],
      useFactory: (configService: ConfigService<IEnvironmentConfiguration>) => {
        const { path, sortSchema, introspection } = configService.get<AppConfigInterface>('appConfig').graphql;
        return {
          autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
          context: ({ req }) => ({ req }),
          sortSchema,
          introspection,
          path,
          playground: false,
          plugins: [ApolloServerPluginLandingPageLocalDefault()],
        };
      },
    }),
    BullModule.forRootAsync({
      inject: [RedisConnectorService],
      useFactory: (redisConnectorService: RedisConnectorService) => {
        return {
          connection: redisConnectorService.connection,
          defaultJobOptions: {
            removeOnComplete: true,
            removeOnFail: false,
            attempts: 3,
          }
        };
      },
    }),
    InfrastructureModule, 
    SharedModule,
    NotificationModule,
    StorageModule,
    PermissionModule,
    RoleModule,
    UserModule,
    AuthModule,
    SuspendedAccountModule,
    ActionTokenModule,
    CategoryModule,
  ],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: ClassSerializerInterceptor,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: ResponseWrapperInterceptor,
    },
    // {
    //   provide: APP_GUARD,
    //   useClass: ThrottlerGuard,
    // },
    {
      provide: APP_FILTER,
      useClass: AllExceptionFilter,
    },
    {
      provide: APP_FILTER,
      useClass: DomainExceptionFilter,
    },
    {
      provide: APP_FILTER,
      useClass: MainExceptionFilter,
    },
    {
      provide: APP_FILTER,
      useClass: I18nValidationExceptionFilter,
    },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(DomainHeadersMiddleware).forRoutes('*');
  }
}

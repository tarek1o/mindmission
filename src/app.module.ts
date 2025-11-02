import { Module, ClassSerializerInterceptor } from '@nestjs/common';
import { APP_FILTER, APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { ThrottlerGuard } from '@nestjs/throttler';
import { ConfigService } from '@nestjs/config';
import { BullModule } from '@nestjs/bullmq';
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
import { DomainExceptionFilter } from './infrastructure/exception-filters/domain-exception.filter';
import { HttpExceptionFilter } from './infrastructure/exception-filters/http-exception.filter';
import { AllExceptionFilter } from './infrastructure/exception-filters/all-exception.filter';
import { I18nValidationExceptionFilter } from './infrastructure/exception-filters/i18n-validation-exception.filter';
import { ResponseWrapperInterceptor } from './infrastructure/interceptors/response-wrapper.interceptor';
import { IEnvironmentConfiguration } from './infrastructure/configuration/interfaces/config.interface';
import { IRedisConfiguration } from './infrastructure/configuration/interfaces/sub-interfaces/redis.interface';

@Module({
  imports: [
    BullModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService<IEnvironmentConfiguration>) => {
        const connection = configService.get<IRedisConfiguration>('redis');
        return {
          connection,
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
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
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
      useClass: HttpExceptionFilter,
    },
    {
      provide: APP_FILTER,
      useClass: I18nValidationExceptionFilter,
    },
  ],
})
export class AppModule {}

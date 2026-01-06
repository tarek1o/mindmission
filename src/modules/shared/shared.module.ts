import { Global, Logger, Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bullmq';
import './presentation/graphql/index';
import { configService } from 'src/infrastructure/configuration/services/config-instance.service';
import { WinstonLoggerService } from './infrastructure/logger/console/winston.logger.service';
import { LOGGER_SERVICE } from './application/constant/logger-service.constant';
import { DatabaseLoggerService } from './infrastructure/logger/db/database.logger.service';
import { TRANSLATION_SERVICE } from './application/constant/translation-service.constant';
import { TranslationService } from './infrastructure/localization/translation.service';
import { UNIT_OF_WORK } from './application/constant/unit-of-work.constant';
import { UnitOfWorkService } from './infrastructure/database/services/unit-of-work.service';
import { RoleModule } from '../role/role.module';
import { PermissionModule } from '../permission/permission.module';
import { ActionTokenModule } from '../action-token/action-token.module';
import { QUEUE_PUBLISHER_SERVICE } from './application/constant/queue-publisher-service.constant';
import { QueuePublisherService } from './infrastructure/services/queue-publisher.service';
import { RedisConnectorService } from './infrastructure/cache/services/redis-connector.service';

@Global()
@Module({
  imports: [
    BullModule.registerQueue(
      {
        name: configService.getString('BULLMQ_RESET_PASSWORD_QUEUE'),
      },
      {
        name: configService.getString('BULLMQ_EMAIL_VERIFICATION_QUEUE'),
      },
      {
        name: configService.getString('BULLMQ_SET_FIRST_PASSWORD_QUEUE'),
      },
      {
        name: configService.getString('BULLMQ_CHANGE_EMAIL_QUEUE'),
      },
      {
        name: configService.getString('BULLMQ_PASSWORD_CHANGED_QUEUE'),
      },
      {
        name: configService.getString('BULLMQ_WELCOME_QUEUE'),
      },
    ),
    ActionTokenModule,
    RoleModule,
    PermissionModule,
  ],
  providers: [
    Logger,
    WinstonLoggerService,
    DatabaseLoggerService,
    RedisConnectorService,
    {
      provide: QUEUE_PUBLISHER_SERVICE,
      useClass: QueuePublisherService,
    },
    {
      inject: [WinstonLoggerService],
      provide: LOGGER_SERVICE,
      useFactory: (winstonLogger: WinstonLoggerService) => {
        return winstonLogger;
      },
    },
    {
      provide: TRANSLATION_SERVICE,
      useClass: TranslationService,
    },
    {
      provide: UNIT_OF_WORK,
      useClass: UnitOfWorkService,
    },
  ],
  exports: [
    QUEUE_PUBLISHER_SERVICE,
    LOGGER_SERVICE,
    TRANSLATION_SERVICE,
    UNIT_OF_WORK,
    ActionTokenModule,
    RoleModule,
    PermissionModule,
    RedisConnectorService,
  ],
})
export class SharedModule {}

import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NOTIFICATION_REPOSITORY } from './application/constants/notification-repository.constant';
import { NotificationRepository } from './infrastructure/database/repositories/notification.repository';
import { NotificationEntity } from './infrastructure/database/entities/notification.entity';
import { NotificationChannelEnum } from './domain/enums/notification-channel.enum';
import { NotificationSenderService } from './application/services/notification.service';
import { EmailService } from './infrastructure/providers/mail/services/email.service';
import { WhatsappService } from './infrastructure/providers/whatsapp/services/whatsapp.service';
import { CreateNotificationSettingsUseCase } from './application/use-cases/create-notification-settings.use-case';
import { NOTIFICATION_SETTINGS_REPOSITORY } from './application/constants/notification-settings-repository.constant';
import { NotificationSettingsRepository } from './infrastructure/database/repositories/notification-settings.repository';
import { NOTIFICATION_SETTINGS_CACHE_SERVICE } from './application/constants/notification-settings-cache.constant';
import { NotificationSettingsCacheService } from './infrastructure/cache/services/notification-settings.cache.service';
import { NotificationSettingsEntity } from './infrastructure/database/entities/notification-settings.entity';
import { NotificationSettingsController } from './presentation/controllers/notification-settings.controller';
import { NotificationSettingsFinderService } from './application/services/notification-settings-finder.service';
import { NotificationSettingsValidatorService } from './application/services/notification-settings-validator.service';
import { GetNotificationSettingsByIdUseCase } from './application/use-cases/get-notification-settings-by-id.use-case';
import { GetAllNotificationSettingsUseCase } from './application/use-cases/get-all-notification-settings.use-case';
import { UpdateNotificationSettingsUseCase } from './application/use-cases/update-notification-settings.use-case';
import { AuthMiddleware } from '../shared/presentation/middlewares/auth.middleware';
import { NOTIFICATION_SERVICE } from './application/constants/notification-service.constant';
import { NotificationService } from './infrastructure/providers/services/notification.service';
import { NotificationChannelFinderService } from './infrastructure/providers/services/notification-channel-finder.service';
import { IEnvironmentConfiguration } from 'src/infrastructure/configuration/interfaces/config.interface';
import { BullMQConfigurations } from 'src/infrastructure/configuration/interfaces/sub-interfaces/bull-mq-configurations.interface';
import { EmailVerificationNotificationMessage } from '../auth/application/notification/messages/email-verification-notification.message.';
import { SetFirstPasswordNotificationMessage } from '../user/application/notification/messages/set-first-password.message';
import { PasswordChangedNotificationMessage } from '../user/application/notification/messages/password-changed-notification-message.input';
import { ChangeEmailNotificationMessage } from '../user/application/notification/messages/change-email-notification-message.input';
import { ResetPasswordNotificationMessage } from '../auth/application/notification/messages/reset-password-notification.message';
import { WelcomeNotificationMessage } from '../auth/application/notification/messages/welcome-notification-message';
import { NotificationMessage } from './application/messages/notification.message';
import { NOTIFICATION_QUEUE_MAPPING } from './application/constants/notification-queue-mapping.constant';

@Module({
  imports: [
    TypeOrmModule.forFeature([NotificationEntity, NotificationSettingsEntity]),
  ],
  controllers: [NotificationSettingsController],
  providers: [
    {
      provide: NOTIFICATION_REPOSITORY,
      useClass: NotificationRepository,
    },
    {
      provide: NOTIFICATION_SETTINGS_REPOSITORY,
      useClass: NotificationSettingsRepository,
    },
    {
      provide: NOTIFICATION_SETTINGS_CACHE_SERVICE,
      useClass: NotificationSettingsCacheService,
    },
    NotificationSenderService,
    {
      provide: NotificationChannelEnum.EMAIL,
      useClass: EmailService,
    },
    {
      provide: NotificationChannelEnum.WHATSAPP,
      useClass: WhatsappService,
    },
    {
      provide: NOTIFICATION_SERVICE,
      useClass: NotificationService,
    },
    {
      provide: NOTIFICATION_QUEUE_MAPPING,
      inject: [ConfigService],
      useFactory: (
        configService: ConfigService<IEnvironmentConfiguration, true>,
      ) => {
        const {
          emailVerificationQueue,
          resetPasswordQueue,
          setFirstPasswordQueue,
          changeEmailQueue,
          passwordChangedQueue,
          welcomeQueue,
        } = configService.get<BullMQConfigurations>('bullMQ').queues;
        const mappings = new Map<NotificationMessage, string>();
        mappings.set(
          EmailVerificationNotificationMessage,
          emailVerificationQueue,
        );
        mappings.set(
          SetFirstPasswordNotificationMessage,
          setFirstPasswordQueue,
        );
        mappings.set(ChangeEmailNotificationMessage, changeEmailQueue);
        mappings.set(PasswordChangedNotificationMessage, passwordChangedQueue);
        mappings.set(ResetPasswordNotificationMessage, resetPasswordQueue);
        mappings.set(WelcomeNotificationMessage, welcomeQueue);
        return mappings;
      },
    },
    NotificationSettingsFinderService,
    NotificationSettingsValidatorService,
    GetAllNotificationSettingsUseCase,
    GetNotificationSettingsByIdUseCase,
    CreateNotificationSettingsUseCase,
    UpdateNotificationSettingsUseCase,
    NotificationChannelFinderService,
  ],
  exports: [
    NotificationChannelFinderService,
    NotificationSenderService,
    NOTIFICATION_SERVICE,
  ],
})
export class NotificationModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthMiddleware).forRoutes(NotificationSettingsController);
  }
}

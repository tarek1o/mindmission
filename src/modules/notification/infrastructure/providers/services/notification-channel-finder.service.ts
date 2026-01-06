import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NOTIFICATION_SETTINGS_REPOSITORY } from 'src/modules/notification/application/constants/notification-settings-repository.constant';
import { INotificationSettingsRepository } from 'src/modules/notification/application/interfaces/notification-settings-repository.interface';
import { NOTIFICATION_SETTINGS_CACHE_SERVICE } from 'src/modules/notification/application/constants/notification-settings-cache.constant';
import { INotificationSettingsCacheService } from 'src/modules/notification/application/interfaces/notification-settings-cache.service.interface';
import { IEnvironmentConfiguration } from 'src/infrastructure/configuration/interfaces/config.interface';
import { NotificationChannelEnum } from 'src/modules/notification/domain/enums/notification-channel.enum';
import { NotificationEventEnum } from 'src/modules/notification/domain/enums/notification-event.enum';
import { SettingsConfiguration } from 'src/infrastructure/configuration/interfaces/sub-interfaces/settings.configuration.interface';

@Injectable()
export class NotificationChannelFinderService {
  constructor(
    @Inject(NOTIFICATION_SETTINGS_REPOSITORY)
    private readonly notificationSettingsRepository: INotificationSettingsRepository,
    @Inject(NOTIFICATION_SETTINGS_CACHE_SERVICE)
    private readonly notificationSettingsCacheService: INotificationSettingsCacheService,
    private readonly configService: ConfigService<
      IEnvironmentConfiguration,
      true
    >,
  ) {}

  async getChannel(
    event: NotificationEventEnum,
  ): Promise<NotificationChannelEnum> {
    return (
      (await this.notificationSettingsCacheService.getOne(event))
        ?.notificationChannel ??
      (await this.notificationSettingsRepository.getByEvent(event))
        ?.notificationChannel ??
      this.configService.get<SettingsConfiguration>('settings').notifications
        .defaultChannel
    );
  }
}

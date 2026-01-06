import { Inject, Injectable } from '@nestjs/common';
import { INotificationSettingsRepository } from '../interfaces/notification-settings-repository.interface';
import { NOTIFICATION_SETTINGS_REPOSITORY } from '../constants/notification-settings-repository.constant';
import { NOTIFICATION_SETTINGS_CACHE_SERVICE } from '../constants/notification-settings-cache.constant';
import { INotificationSettingsCacheService } from '../interfaces/notification-settings-cache.service.interface';
import { NotificationSettingsModel } from '../../domain/models/notification-settings.model';
import { NotificationEventEnum } from '../../domain/enums/notification-event.enum';
import { ConflictError } from 'src/modules/shared/domain/errors/conflict.error';
import { NotificationSettingsInput } from '../inputs/notification-settings.input';
import { NotificationSettingsCacheMapper } from '../mappers/notification-settings-cache.mapper';
import { NotificationSettingsValidatorService } from '../services/notification-settings-validator.service';

@Injectable()
export class CreateNotificationSettingsUseCase {
  constructor(
    private readonly notificationSettingsValidatorService: NotificationSettingsValidatorService,
    @Inject(NOTIFICATION_SETTINGS_REPOSITORY)
    private readonly notificationSettingsRepository: INotificationSettingsRepository,
    @Inject(NOTIFICATION_SETTINGS_CACHE_SERVICE)
    private readonly notificationSettingsCacheService: INotificationSettingsCacheService,
  ) {}

  private async create(
    input: NotificationSettingsInput,
  ): Promise<NotificationSettingsModel> {
    const notificationSettingsModel = new NotificationSettingsModel({
      notificationEvent: input.notificationEvent,
      notificationChannel: input.notificationChannel,
    });
    return this.notificationSettingsRepository.save(notificationSettingsModel);
  }

  private async cacheCreatedNotificationSettings(
    notificationSettings: NotificationSettingsModel,
  ): Promise<void> {
    const notificationSettingsCacheViewModel =
      NotificationSettingsCacheMapper.toCacheViewModel(notificationSettings);
    await this.notificationSettingsCacheService.saveOne(
      notificationSettingsCacheViewModel,
    );
  }

  async execute(
    input: NotificationSettingsInput,
  ): Promise<NotificationSettingsModel> {
    await this.notificationSettingsValidatorService.validateNotificationEventNotDuplicate(
      input.notificationEvent,
    );
    const notificationSettings = await this.create(input);
    await this.cacheCreatedNotificationSettings(notificationSettings);
    return notificationSettings;
  }
}

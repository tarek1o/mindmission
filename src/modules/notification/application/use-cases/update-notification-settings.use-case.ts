import { Inject, Injectable } from "@nestjs/common";
import { INotificationSettingsRepository } from "../interfaces/notification-settings-repository.interface";
import { NOTIFICATION_SETTINGS_REPOSITORY } from "../constants/notification-settings-repository.constant";
import { NOTIFICATION_SETTINGS_CACHE_SERVICE } from "../constants/notification-settings-cache.constant";
import { INotificationSettingsCacheService } from "../interfaces/notification-settings-cache.service.interface";
import { NotificationSettingsModel } from "../../domain/models/notification-settings.model";
import { NotificationSettingsInput } from "../inputs/notification-settings.input";
import { NotificationSettingsCacheMapper } from "../mappers/notification-settings-cache.mapper";
import { NotificationSettingsFinderService } from "../services/notification-settings-finder.service";
import { NotificationSettingsValidatorService } from "../services/notification-settings-validator.service";

@Injectable()
export class UpdateNotificationSettingsUseCase {
  constructor(
    private readonly notificationSettingsFinderService: NotificationSettingsFinderService,
    private readonly notificationSettingsValidatorService: NotificationSettingsValidatorService,
    @Inject(NOTIFICATION_SETTINGS_REPOSITORY) private readonly notificationSettingsRepository: INotificationSettingsRepository,
    @Inject(NOTIFICATION_SETTINGS_CACHE_SERVICE) private readonly notificationSettingsCacheService: INotificationSettingsCacheService,
  ) {}

  private async update(notificationSettings: NotificationSettingsModel, input: Partial<NotificationSettingsInput>): Promise<NotificationSettingsModel> {
    notificationSettings.update({
      notificationEvent: input.notificationEvent,
      notificationChannel: input.notificationChannel,
    });
    return this.notificationSettingsRepository.save(notificationSettings);
  }

  private async cacheUpdatedNotificationSettings(notificationSettings: NotificationSettingsModel): Promise<void> {
    const notificationSettingsCacheViewModel = NotificationSettingsCacheMapper.toCacheViewModel(notificationSettings);
    await this.notificationSettingsCacheService.saveOne(notificationSettingsCacheViewModel);
  }

  async execute(id: number, input: Partial<NotificationSettingsInput>): Promise<NotificationSettingsModel> {
    const notificationSettings = await this.notificationSettingsFinderService.getById(id);
    await this.notificationSettingsValidatorService.validateNotificationEventNotDuplicate(input.notificationEvent, id);
    const updatedNotificationSettings = await this.update(notificationSettings, input);
    await this.cacheUpdatedNotificationSettings(updatedNotificationSettings);
    return notificationSettings;
  }
}

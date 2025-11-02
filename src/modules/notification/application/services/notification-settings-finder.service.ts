import { Inject, Injectable } from "@nestjs/common";
import { NOTIFICATION_SETTINGS_REPOSITORY } from "../constants/notification-settings-repository.constant";
import { INotificationSettingsRepository } from "../interfaces/notification-settings-repository.interface";
import { NotificationSettingsModel } from "../../domain/models/notification-settings.model";
import { ResourceNotFoundError } from "src/modules/shared/domain/errors/resource-not-found.error";

@Injectable()
export class NotificationSettingsFinderService {
  constructor(
    @Inject(NOTIFICATION_SETTINGS_REPOSITORY) private readonly notificationSettingsRepository: INotificationSettingsRepository,
  ) {}

  async getById(id: number): Promise<NotificationSettingsModel> {
    const notificationSettings = await this.notificationSettingsRepository.getById(id);
    if (!notificationSettings) {
      throw new ResourceNotFoundError('notification_settings.not_found', { id });
    }
    return notificationSettings;
  }
}
import { Inject, Injectable } from "@nestjs/common";
import { NOTIFICATION_SETTINGS_REPOSITORY } from "../constants/notification-settings-repository.constant";
import { INotificationSettingsRepository } from "../interfaces/notification-settings-repository.interface";
import { NotificationEventEnum } from "../../domain/enums/notification-event.enum";
import { ConflictError } from "src/modules/shared/domain/errors/conflict.error";

@Injectable()
export class NotificationSettingsValidatorService {
  constructor(
    @Inject(NOTIFICATION_SETTINGS_REPOSITORY) private readonly notificationSettingsRepository: INotificationSettingsRepository,
  ) {}

  async validateNotificationEventNotDuplicate(notificationEvent: NotificationEventEnum, id?: number): Promise<void> {
    const existingNotificationSettings = await this.notificationSettingsRepository.getByEvent(notificationEvent);
    if (existingNotificationSettings && existingNotificationSettings.id !== id) {
      throw new ConflictError('notification_settings.notification_event.duplicate');
    }
  }
}
import { NotificationChannelEnum } from 'src/modules/notification/domain/enums/notification-channel.enum';
import { NotificationEventEnum } from 'src/modules/notification/domain/enums/notification-event.enum';
import { NotificationSettingsModel } from 'src/modules/notification/domain/models/notification-settings.model';

export class NotificationSettingsResponseDto {
  id: number;
  notificationEvent: NotificationEventEnum;
  notificationChannel: NotificationChannelEnum;
  createdAt: Date;
  updatedAt: Date;

  constructor(notificationSettings: NotificationSettingsModel) {
    this.id = notificationSettings.id;
    this.notificationEvent = notificationSettings.notificationEvent;
    this.notificationChannel = notificationSettings.notificationChannel;
    this.createdAt = notificationSettings.createdAt;
    this.updatedAt = notificationSettings.updatedAt;
  }
}

import { NotificationChannelEnum } from '../../domain/enums/notification-channel.enum';
import { NotificationEventEnum } from '../../domain/enums/notification-event.enum';

export interface NotificationSettingsInput {
  notificationEvent: NotificationEventEnum;
  notificationChannel: NotificationChannelEnum;
}

import { NotificationChannelEnum } from "src/modules/notification/domain/enums/notification-channel.enum";

export interface SettingsConfiguration {
  notifications: {
    defaultChannel: NotificationChannelEnum;
  }
}
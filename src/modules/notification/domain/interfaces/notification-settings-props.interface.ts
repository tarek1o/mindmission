import { BaseModelProps } from "src/modules/shared/domain/interfaces/base-model-props.interface";
import { NotificationEventEnum } from "../enums/notification-event.enum";
import { NotificationChannelEnum } from "../enums/notification-channel.enum";

export interface NotificationSettingsProps extends BaseModelProps {
  notificationEvent: NotificationEventEnum;
  notificationChannel: NotificationChannelEnum;
}
import { BaseModel } from "src/modules/shared/domain/models/base.model";
import { NotificationEventEnum } from "../enums/notification-event.enum";
import { NotificationChannelEnum } from "../enums/notification-channel.enum";
import { NotificationSettingsProps } from "../interfaces/notification-settings-props.interface";

export class NotificationSettingsModel extends BaseModel {
  notificationEvent: NotificationEventEnum;
  notificationChannel: NotificationChannelEnum;

  constructor(props: NotificationSettingsProps) {
    super(props);
    this.notificationEvent = props.notificationEvent;
    this.notificationChannel = props.notificationChannel;
  }

  override update(props: Partial<NotificationSettingsProps>): void {
    super.update(props);
    this.notificationEvent = props.notificationEvent ?? this.notificationEvent;
    this.notificationChannel = props.notificationChannel ?? this.notificationChannel;
  }
}
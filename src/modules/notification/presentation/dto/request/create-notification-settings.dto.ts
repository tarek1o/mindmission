import { NotificationSettingsInput } from "src/modules/notification/application/inputs/notification-settings.input";
import { NotificationEventEnum } from "src/modules/notification/domain/enums/notification-event.enum";
import { NotificationChannelEnum } from "src/modules/notification/domain/enums/notification-channel.enum";
import { IsEnum, IsNotEmpty } from "class-validator";

export class CreateNotificationSettingsDto implements NotificationSettingsInput {
  @IsEnum(NotificationEventEnum)
  @IsNotEmpty()
  notificationEvent: NotificationEventEnum;

  @IsEnum(NotificationChannelEnum)
  @IsNotEmpty()
  notificationChannel: NotificationChannelEnum;
}
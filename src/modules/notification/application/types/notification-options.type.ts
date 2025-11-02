import { NotificationChannelEnum } from "../../domain/enums/notification-channel.enum";
import { NotificationTemplateEnum } from "../enums/notification-template.enum";

export type NotificationOptionsType = {
  channel: NotificationChannelEnum;
  to: string;
  template: NotificationTemplateEnum;
  subject?: string;
  message?: string;
  context?: Record<string, unknown>;
};
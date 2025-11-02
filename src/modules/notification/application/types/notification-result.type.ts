import { NotificationStatusEnum } from "../../domain/enums/notification-status.enum";

export type NotificationResultType = {
  status: NotificationStatusEnum;
  messageId: string;
}
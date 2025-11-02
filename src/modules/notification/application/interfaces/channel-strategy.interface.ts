import { NotificationResultType } from "../types/notification-result.type";
import { NotificationOptionsType } from "../types/notification-options.type";

export interface IChannelStrategy {
  send(options: NotificationOptionsType): Promise<NotificationResultType>;
}
import { NotificationModel } from "../../domain/models/notification.model";

export interface INotificationRepository {
  getById(id: number): Promise<NotificationModel | null>;
  getByMessageId(messageId: string): Promise<NotificationModel | null>;
  save(notification: NotificationModel, manager?: unknown): Promise<NotificationModel>;
}
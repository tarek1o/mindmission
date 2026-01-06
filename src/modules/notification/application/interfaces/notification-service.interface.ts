import { NotificationMessage } from '../messages/notification.message';

export interface INotificationService {
  send(message: NotificationMessage): Promise<void>;
}

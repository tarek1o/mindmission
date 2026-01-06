import { IBaseRepository } from 'src/modules/shared/application/interfaces/base-repository.interface';
import { NotificationModel } from '../../domain/models/notification.model';

export interface INotificationRepository extends IBaseRepository<NotificationModel> {
  getById(id: number): Promise<NotificationModel | null>;
  getByMessageId(messageId: string): Promise<NotificationModel | null>;
}

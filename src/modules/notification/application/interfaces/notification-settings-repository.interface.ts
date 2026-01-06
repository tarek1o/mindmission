import { Pagination } from 'src/modules/shared/application/interfaces/pagination.interface';
import { NotificationEventEnum } from '../../domain/enums/notification-event.enum';
import { NotificationSettingsModel } from '../../domain/models/notification-settings.model';
import { IOrder } from 'src/modules/shared/application/interfaces/order.interface';
import { GetAllNotificationSettingsQueryInput } from '../inputs/get-all-notification-settings-query.input';
import { AllowedNotificationSettingsOrderColumnsEnum } from '../enums/allowed-notification-settings-order-columns.enum';

export interface INotificationSettingsRepository {
  getAllPaginatedAndTotalCount(
    query: GetAllNotificationSettingsQueryInput,
    order: IOrder<AllowedNotificationSettingsOrderColumnsEnum>,
    pagination: Pagination,
  ): Promise<{ models: NotificationSettingsModel[]; count: number }>;
  getById(id: number): Promise<NotificationSettingsModel | null>;
  getByEvent(
    event: NotificationEventEnum,
  ): Promise<NotificationSettingsModel | null>;
  save(
    model: NotificationSettingsModel,
    manager?: unknown,
  ): Promise<NotificationSettingsModel>;
}

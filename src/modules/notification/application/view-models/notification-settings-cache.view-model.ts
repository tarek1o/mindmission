import { BaseCacheViewModel } from 'src/modules/shared/application/view-models/base-cache.view-model';
import { NotificationChannelEnum } from '../../domain/enums/notification-channel.enum';

export interface NotificationSettingsCacheViewModel extends BaseCacheViewModel {
  notificationChannel: NotificationChannelEnum;
}

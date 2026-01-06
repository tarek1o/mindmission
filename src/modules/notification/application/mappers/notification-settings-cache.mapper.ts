import { NotificationSettingsModel } from '../../domain/models/notification-settings.model';
import { NotificationSettingsCacheViewModel } from '../view-models/notification-settings-cache.view-model';

export abstract class NotificationSettingsCacheMapper {
  static toCacheViewModel(
    model: NotificationSettingsModel,
  ): NotificationSettingsCacheViewModel {
    return {
      id: model.notificationEvent,
      notificationChannel: model.notificationChannel,
    };
  }
}

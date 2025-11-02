import { IBaseCacheService } from "src/modules/shared/application/interfaces/base-cache-service.interface";
import { NotificationSettingsCacheViewModel } from "../view-models/notification-settings-cache.view-model";

export interface INotificationSettingsCacheService extends IBaseCacheService<NotificationSettingsCacheViewModel> {}
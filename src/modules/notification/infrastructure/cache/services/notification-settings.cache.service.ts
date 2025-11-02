import { Injectable } from "@nestjs/common";
import { InjectRedis } from "@nestjs-modules/ioredis";
import Redis from "ioredis";
import { BaseCacheService } from "src/modules/shared/infrastructure/cache/services/base-cache.service";
import { INotificationSettingsCacheService } from "src/modules/notification/application/interfaces/notification-settings-cache.service.interface";
import { NotificationSettingsCacheViewModel } from "src/modules/notification/application/view-models/notification-settings-cache.view-model";

@Injectable()
export class NotificationSettingsCacheService extends BaseCacheService<NotificationSettingsCacheViewModel> implements INotificationSettingsCacheService {
  constructor(@InjectRedis() redis: Redis) {
    super('notification_settings', redis)
  }
}
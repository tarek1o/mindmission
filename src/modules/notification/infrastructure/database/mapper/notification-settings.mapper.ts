import { NotificationSettingsModel } from 'src/modules/notification/domain/models/notification-settings.model';
import { NotificationSettingsEntity } from '../entities/notification-settings.entity';

export abstract class NotificationSettingsMapper {
  static toEntity(
    model: NotificationSettingsModel,
  ): NotificationSettingsEntity {
    return new NotificationSettingsEntity({
      id: model.id,
      notificationEvent: model.notificationEvent,
      notificationChannel: model.notificationChannel,
      createdAt: model.createdAt,
      updatedAt: model.updatedAt,
      deletedAt: model.deletedAt,
    });
  }

  static toModel(
    entity: NotificationSettingsEntity,
  ): NotificationSettingsModel {
    return new NotificationSettingsModel({
      id: entity.id,
      notificationEvent: entity.notificationEvent,
      notificationChannel: entity.notificationChannel,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
      deletedAt: entity.deletedAt,
    });
  }
}

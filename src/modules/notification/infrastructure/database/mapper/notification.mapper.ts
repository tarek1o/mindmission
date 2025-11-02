import { NotificationEntity } from "../entities/notification.entity";
import { NotificationModel } from "src/modules/notification/domain/models/notification.model";

export abstract class NotificationMapper {
  static toModel(entity: NotificationEntity): NotificationModel {
    return new NotificationModel({
      id: entity.id,
      channel: entity.channel,
      to: entity.to,
      subject: entity.subject,
      template: entity.template,
      context: entity.context,
      messageId: entity.messageId,
      status: entity.status,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
      deletedAt: entity.deletedAt,
    });
  }

  static toEntity(model: NotificationModel): NotificationEntity {
    return new NotificationEntity({
      id: model.id,
      channel: model.channel,
      to: model.to,
      subject: model.subject,
      template: model.template,
      context: model.context,
      messageId: model.messageId,
      status: model.status,
      createdAt: model.createdAt,
      updatedAt: model.updatedAt,
      deletedAt: model.deletedAt,
    });
  }
}
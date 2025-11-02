import { PermissionModel } from '../../../domain/models/permission.model';
import { PermissionEntity } from '../entities/permission.entity';

export abstract class PermissionMapper {
  static toModel(entity: PermissionEntity): PermissionModel {
    return new PermissionModel({
      id: entity.id,
      resource: entity.resource,
      actions: entity.actions,
      isResourceAndActionsEditable: entity.isResourceAndActionsEditable,
      isDeletable: entity.isDeletable,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
      deletedAt: entity.deletedAt,
    });
  }

  static toEntity(model: PermissionModel): PermissionEntity {
    return new PermissionEntity({
      id: model.id,
      resource: model.resource,
      actions: model.actions,
      level: model.level,
      isResourceAndActionsEditable: model.isResourceAndActionsEditable,
      isDeletable: model.isDeletable,
      createdAt: model.createdAt,
      updatedAt: model.updatedAt,
      deletedAt: model.deletedAt,
    });
  }
}

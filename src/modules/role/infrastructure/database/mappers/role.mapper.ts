import { RoleModel } from "../../../domain/models/role.model";
import { RoleEntity } from "../entities/role.entity";
import { PermissionMapper } from "src/modules/permission/infrastructure/database/mappers/permission.mapper";

export abstract class RoleMapper {
  static toModel(entity: RoleEntity): RoleModel {
    return new RoleModel({
      id: entity.id,
      permissions: entity.permissions.map((permission) => PermissionMapper.toModel(permission)),
      arePermissionsEditable: entity.arePermissionsEditable,
      isDeletable: entity.isDeletable,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
      deletedAt: entity.deletedAt,
    });
  }

  static toEntity(model: RoleModel): RoleEntity {
    return new RoleEntity({
      id: model.id,
      permissions: model.permissions.map((permission) => PermissionMapper.toEntity(permission)),
      arePermissionsEditable: model.arePermissionsEditable,
      isDeletable: model.isDeletable,
      createdAt: model.createdAt,
      updatedAt: model.updatedAt,
      deletedAt: model.deletedAt,
    });
  }
}

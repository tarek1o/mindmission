import { UserProfileChangeModel } from "src/modules/user/domain/models/user-profile-change.model";
import { UserProfileChangeEntity } from "../entities/user-profile-change.entity";

export abstract class UserProfileChangeMapper {
  static toModel(entity: UserProfileChangeEntity): UserProfileChangeModel {
    return new UserProfileChangeModel({
      id: entity.id,
      userId: entity.userId,
      field: entity.field,
      oldValue: entity.oldValue,
      newValue: entity.newValue,
      status: entity.status,
      statusChangedAt: entity.statusChangedAt,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
      deletedAt: entity.deletedAt,      
    })
  }

  static toEntity(model: UserProfileChangeModel): UserProfileChangeEntity {
    return new UserProfileChangeEntity({
      id: model.id,
      userId: model.userId,
      field: model.field,
      oldValue: model.oldValue,
      newValue: model.newValue,
      status: model.status,
      statusChangedAt: model.statusChangedAt,
      createdAt: model.createdAt,
      updatedAt: model.updatedAt,
      deletedAt: model.deletedAt,
    })
  }
}
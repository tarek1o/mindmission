import { UserModel } from 'src/modules/user/domain/models/user.model';
import { UserEntity } from '../entities/user.entity';
import { RoleMapper } from 'src/modules/role/infrastructure/database/mappers/role.mapper';

export abstract class UserMapper {
  static toModel(entity: UserEntity): UserModel {
    return new UserModel({
      id: entity.id,
      firstName: entity.firstName,
      lastName: entity.lastName,
      email: entity.email,
      isEmailVerified: entity.isEmailVerified,
      password: entity.password,
      isPasswordSet: entity.isPasswordSet,
      lastUpdatePasswordTime: entity.lastUpdatePasswordTime,
      types: entity.types,
      mobilePhone: entity.mobilePhone,
      whatsAppNumber: entity.whatsAppNumber,
      picture: entity.picture,
      roles: entity.roles.map((role) => RoleMapper.toModel(role)),
      isBlocked: entity.isBlocked,
      isProtected: entity.isProtected,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
      deletedAt: entity.deletedAt,
    });
  }

  static toEntity(model: UserModel): UserEntity {
    return new UserEntity({
      id: model.id,
      firstName: model.firstName,
      lastName: model.lastName,
      appUi: model.appUi,
      email: model.email,
      isEmailVerified: model.isEmailVerified,
      password: model.password,
      isPasswordSet: model.isPasswordSet,
      lastUpdatePasswordTime: model.lastUpdatePasswordTime,
      types: model.types,
      mobilePhone: model.mobilePhone,
      whatsAppNumber: model.whatsAppNumber,
      picture: model.picture,
      roles: model.roles.map((role) => RoleMapper.toEntity(role)),
      isProtected: model.isProtected,
      isBlocked: model.isBlocked,
      createdAt: model.createdAt,
      updatedAt: model.updatedAt,
      deletedAt: model.deletedAt,
    });
  }
}

import { PermissionTranslationEntity } from '../entities/permission-translation.entity';
import { PermissionTranslationModel } from 'src/modules/permission/domain/models/permission-translation.model';
import { SlugifyHelper } from 'src/modules/shared/infrastructure/helpers/slugify.helper';

export abstract class PermissionTranslationMapper {
  static toModel(entity: PermissionTranslationEntity): PermissionTranslationModel {
    return new PermissionTranslationModel({
      id: entity.id,
      language: entity.language,
      name: entity.name,
      description: entity.description,
      permissionId: entity.permissionId,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
      deletedAt: entity.deletedAt,
    });
  }

  static toEntity(model: PermissionTranslationModel): PermissionTranslationEntity {
    return new PermissionTranslationEntity({
      id: model.id,
      language: model.language,
      name: model.name,
      slug: SlugifyHelper.slugify(model.name),
      description: model.description,
      permissionId: model.permissionId,
      createdAt: model.createdAt,
      updatedAt: model.updatedAt,
      deletedAt: model.deletedAt,
    });
  }
}

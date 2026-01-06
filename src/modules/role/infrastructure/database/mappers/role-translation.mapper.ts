import { SlugifyHelper } from 'src/modules/shared/infrastructure/helpers/slugify.helper';
import { RoleTranslationModel } from '../../../domain/models/role-translation.model';
import { RoleTranslationEntity } from '../entities/role-translation.entity';

export abstract class RoleTranslationMapper {
  static toModel(entity: RoleTranslationEntity): RoleTranslationModel {
    return new RoleTranslationModel({
      id: entity.id,
      language: entity.language,
      name: entity.name,
      description: entity.description,
      roleId: entity.roleId,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
      deletedAt: entity.deletedAt,
    });
  }

  static toEntity(model: RoleTranslationModel): RoleTranslationEntity {
    return new RoleTranslationEntity({
      id: model.id,
      language: model.language,
      name: model.name,
      slug: SlugifyHelper.slugify(model.name),
      description: model.description,
      roleId: model.roleId,
      createdAt: model.createdAt,
      updatedAt: model.updatedAt,
      deletedAt: model.deletedAt,
    });
  }
}

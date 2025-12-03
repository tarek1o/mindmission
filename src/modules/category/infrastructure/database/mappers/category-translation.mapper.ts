import { CategoryTranslationModel } from "src/modules/category/domain/models/category-translation.model";
import { CategoryTranslationEntity } from "../entities/category-translation.entity";
import { SlugifyHelper } from "src/modules/shared/infrastructure/helpers/slugify.helper";

export abstract class CategoryTranslationMapper {
  static toModel(entity: CategoryTranslationEntity): CategoryTranslationModel {
    return new CategoryTranslationModel({
      id: entity.id,
      categoryId: entity.categoryId,
      language: entity.language,
      name: entity.name,
      description: entity.description,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
      deletedAt: entity.deletedAt,
    });
  } 

  static toEntity(model: CategoryTranslationModel): CategoryTranslationEntity {
    return new CategoryTranslationEntity({
      id: model.id,
      categoryId: model.categoryId,
      language: model.language,
      name: model.name,
      slug: SlugifyHelper.slugify(model.name),
      description: model.description,
      createdAt: model.createdAt,
      updatedAt: model.updatedAt,
      deletedAt: model.deletedAt,
    });
  } 
}
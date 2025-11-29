import { CategoryModel } from "src/modules/category/domain/models/category.model";
import { CategoryEntity } from "../entities/category.entity";

export abstract class CategoryMapper {
  static toModel(entity: CategoryEntity): CategoryModel {
    return new CategoryModel({
      id: entity.id,
      type: entity.type,
      parentId: entity.parentId,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
      deletedAt: entity.deletedAt,
    });
  }

  static toEntity(model: CategoryModel): CategoryEntity {
    return new CategoryEntity({
      id: model.id,
      type: model.type,
      parentId: model.parentId,
      createdAt: model.createdAt,
      updatedAt: model.updatedAt,
      deletedAt: model.deletedAt,
    });
  }
}
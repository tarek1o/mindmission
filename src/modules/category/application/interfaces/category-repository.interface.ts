import { IBaseRepository } from "src/modules/shared/application/interfaces/base-repository.interface";
import { CategoryModel } from "../../domain/models/category.model";

export interface ICategoryRepository extends IBaseRepository<CategoryModel> {
  getById(id: number): Promise<CategoryModel | null>;
}
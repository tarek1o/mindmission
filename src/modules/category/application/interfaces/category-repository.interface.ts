import { IBaseRepository } from "src/modules/shared/application/interfaces/base-repository.interface";
import { CategoryModel } from "../../domain/models/category.model";
import { GetAllCategoriesQueryInput } from "../inputs/get-all-categories-query.input";
import { IOrder } from "src/modules/shared/application/interfaces/order.interface";
import { AllowedCategoryOrderColumnsEnum } from "../enums/allowed-category-order-columns.enum";
import { Pagination } from "src/modules/shared/application/interfaces/pagination.interface";
import { CategoryWithTranslationsViewModel } from "../view-models/category-with-translations.view-model";

export interface ICategoryRepository extends IBaseRepository<CategoryModel> {
  getAllPaginatedAndTotalCount(query: GetAllCategoriesQueryInput, order: IOrder<AllowedCategoryOrderColumnsEnum>, pagination: Pagination): Promise<{ models: any[], count: number }>;
  getById(id: number): Promise<CategoryModel | null>;
  getByIdWithTranslations(id: number): Promise<CategoryWithTranslationsViewModel | null>;
}
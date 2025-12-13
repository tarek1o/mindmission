import { Inject, Injectable } from "@nestjs/common";
import { IOrder } from "src/modules/shared/application/interfaces/order.interface";
import { Pagination } from "src/modules/shared/application/interfaces/pagination.interface";
import { CATEGORY_REPOSITORY } from "../constants/category-repository.constant";
import { ICategoryRepository } from "../interfaces/category-repository.interface";
import { GetAllCategoriesQueryInput } from "../inputs/get-all-categories-query.input";
import { AllowedCategoryOrderColumnsEnum } from "../enums/allowed-category-order-columns.enum";
import { GetAllCategoriesByLanguageViewModel } from "../view-models/get-all-categories-by-language.view-model";

@Injectable()
export class GetAllCategoriesPaginatedWithCountUseCase {
  constructor(
    @Inject(CATEGORY_REPOSITORY) private readonly categoryRepository: ICategoryRepository,
  ) {}

  execute(query: GetAllCategoriesQueryInput, order: IOrder<AllowedCategoryOrderColumnsEnum>, pagination: Pagination): Promise<{ models: GetAllCategoriesByLanguageViewModel[], count: number }> {
    return this.categoryRepository.getAllPaginatedAndTotalCount(query, order, pagination);
  }
}
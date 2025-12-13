import { Body, Controller, Get, Post, Query } from "@nestjs/common";
import { CreateCategoryUseCase } from "src/modules/category/application/use-cases/create-category.use-case";
import { CreateCategoryDto } from "../dto/request/create-category.dto";
import { CategoryDetailsResponseDto } from "../dto/response/category-details.response.dto";
import { GetAllCategoriesPaginatedWithCountUseCase } from "src/modules/category/application/use-cases/get-all-categories-paginated-with-count.use-case";
import { PaginationPipe } from "src/modules/shared/presentation/pipes/pagination.pipe";
import { Pagination } from "src/modules/shared/application/interfaces/pagination.interface";
import { GetAllCategoriesQueryDto } from "../dto/request/get-all-categories-query.dto";
import { LanguageEnum } from "src/modules/shared/domain/enums/language.enum";
import { AcceptLanguage } from "src/infrastructure/localization/decorator/accept-language.decorator";
import { CategoryOrderDto } from "../dto/request/category-order.dto";

@Controller({ path: 'categories', version: '1'})
export class CategoryController {
  constructor(
    private readonly getAllCategoriesPaginatedWithCountUseCase: GetAllCategoriesPaginatedWithCountUseCase,
    private readonly createCategoryUseCase: CreateCategoryUseCase,
  ) {}

  @Get()
  async getAllCategoriesPaginatedWithCount(
    @AcceptLanguage() language: LanguageEnum,
    @Query() query: GetAllCategoriesQueryDto, 
    @Query() order: CategoryOrderDto, 
    @Query(PaginationPipe) pagination: Pagination,
  ) {
    const { models: data, count } = await this.getAllCategoriesPaginatedWithCountUseCase.execute({ ...query, language }, order, pagination);
    return {
      data,
      count,
    }
  }

  @Post()
  async createCategory(@Body() createCategoryDto: CreateCategoryDto): Promise<CategoryDetailsResponseDto> {
    const categoryWithTranslationsViewModel = await this.createCategoryUseCase.execute(createCategoryDto);
    return new CategoryDetailsResponseDto(categoryWithTranslationsViewModel);
  }
}
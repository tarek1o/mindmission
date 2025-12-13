import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Query } from "@nestjs/common";
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
import { GetCategoryWithTranslationsByIdUseCase } from "src/modules/category/application/use-cases/get-category-with-translations-by-id.use-case";
import { GetCategoryTranslationsByLanguageUseCase } from "src/modules/category/application/use-cases/get-category-translations-by-language.use-case";
import { UpdateCategoryUseCase } from "src/modules/category/application/use-cases/update-category.use-case";
import { DeleteCategoryUseCase } from "src/modules/category/application/use-cases/delete-category.use-case";
import { UpdateCategoryDto } from "../dto/request/update-category.dto";
import { CategoryListResponseDto } from "../dto/response/category-list.response.dto";

@Controller({ path: 'categories', version: '1'})
export class CategoryController {
  constructor(
    private readonly getAllCategoriesPaginatedWithCountUseCase: GetAllCategoriesPaginatedWithCountUseCase,
    private readonly getCategoryTranslationsByLanguageUseCase: GetCategoryTranslationsByLanguageUseCase,
    private readonly getCategoryByIdUseCase: GetCategoryWithTranslationsByIdUseCase,
    private readonly createCategoryUseCase: CreateCategoryUseCase,
    private readonly updateCategoryUseCase: UpdateCategoryUseCase,
    private readonly deleteCategoryUseCase: DeleteCategoryUseCase,
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

  @Get('list')
  async getByLanguage(
    @AcceptLanguage() language: LanguageEnum
  ): Promise<CategoryListResponseDto[]> {
    const categoryTranslationModels = await this.getCategoryTranslationsByLanguageUseCase.execute(language);
    return categoryTranslationModels.map((categoryTranslationModel) => new CategoryListResponseDto(categoryTranslationModel));
  }

  @Get(':id')
  async getCategoryById(
    @Param('id', ParseIntPipe) id: number
  ): Promise<CategoryDetailsResponseDto> {
    const category = await this.getCategoryByIdUseCase.execute(id);
    return new CategoryDetailsResponseDto(category);
  }

  @Post()
  async createCategory(@Body() createCategoryDto: CreateCategoryDto): Promise<CategoryDetailsResponseDto> {
    const categoryWithTranslationsViewModel = await this.createCategoryUseCase.execute(createCategoryDto);
    return new CategoryDetailsResponseDto(categoryWithTranslationsViewModel);
  }

  @Patch(':id')
  async updateCategory(
    @Param('id', ParseIntPipe) id: number, 
    @Body() updateCategoryDto: UpdateCategoryDto
  ): Promise<CategoryDetailsResponseDto> {
    const updatedCategory = await this.updateCategoryUseCase.execute(id, updateCategoryDto);
    return new CategoryDetailsResponseDto(updatedCategory);
  }

  @Delete(':id')
  async deleteCategory(
    @Param('id', ParseIntPipe) id: number
  ): Promise<void> {
    await this.deleteCategoryUseCase.execute(id);
  }
}
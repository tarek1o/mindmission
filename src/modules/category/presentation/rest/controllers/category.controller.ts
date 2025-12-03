import { Body, Controller, Post } from "@nestjs/common";
import { CreateCategoryUseCase } from "src/modules/category/application/use-cases/create-category.use-case";
import { CreateCategoryDto } from "../dto/request/create-category.dto";
import { CategoryDetailsResponseDto } from "../dto/response/category-details.response.dto";

@Controller({ path: 'categories', version: '1'})
export class CategoryController {
  constructor(
    private readonly createCategoryUseCase: CreateCategoryUseCase,
  ) {}

  @Post()
  async createCategory(@Body() createCategoryDto: CreateCategoryDto): Promise<CategoryDetailsResponseDto> {
    const categoryWithTranslationsViewModel = await this.createCategoryUseCase.execute(createCategoryDto);
    return new CategoryDetailsResponseDto(categoryWithTranslationsViewModel);
  }
}
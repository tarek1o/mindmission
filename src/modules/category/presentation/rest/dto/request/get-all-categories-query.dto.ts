import { IsEnum, IsNotEmpty, IsOptional, IsString } from "class-validator";
import { GetAllCategoriesQueryInput } from "src/modules/category/application/inputs/get-all-categories-query.input";
import { CategoryTypeEnum } from "src/modules/category/domain/enums/category-type.enum";
import { LanguageEnum } from "src/modules/shared/domain/enums/language.enum";

export class GetAllCategoriesQueryDto implements GetAllCategoriesQueryInput {
  @IsEnum(CategoryTypeEnum)
  @IsNotEmpty()
  type: CategoryTypeEnum;

  language: LanguageEnum;

  @IsString()
  @IsOptional()
  name?: string;
}
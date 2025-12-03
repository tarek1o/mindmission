import { CategoryTranslationModel } from "src/modules/category/domain/models/category-translation.model";
import { LanguageEnum } from "src/modules/shared/domain/enums/language.enum";

export class CategoryTranslationResponseDto {
  language: LanguageEnum;
  name: string;
  description: string | null;

  constructor(categoryTranslationViewModel: CategoryTranslationModel) {
    this.language = categoryTranslationViewModel.language;
    this.name = categoryTranslationViewModel.name;
    this.description = categoryTranslationViewModel.description;
  }
}
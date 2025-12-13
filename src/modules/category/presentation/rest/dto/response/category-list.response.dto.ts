import { GetCategoryTranslationByLanguageViewModel } from "src/modules/category/application/view-models/get-category-translation-by-language.view-model";

export class CategoryListResponseDto {
  id: number;
  name: string;

  constructor(categoryTranslationViewModel: GetCategoryTranslationByLanguageViewModel) {
    this.id = categoryTranslationViewModel.categoryId;
    this.name = categoryTranslationViewModel.name;
  } 
}


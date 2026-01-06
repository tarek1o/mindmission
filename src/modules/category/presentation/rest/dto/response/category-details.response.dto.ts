import { CategoryWithTranslationsViewModel } from 'src/modules/category/application/view-models/category-with-translations.view-model';
import { CategoryTranslationResponseDto } from './category-translation.response.dto';

export class CategoryDetailsResponseDto {
  id: number;
  translations: CategoryTranslationResponseDto[];
  parentId: number | null;
  createdAt: Date;
  updatedAt: Date;

  constructor(
    categoryWithTranslationsViewModel: CategoryWithTranslationsViewModel,
  ) {
    const { category, translations } = categoryWithTranslationsViewModel;
    this.id = category.id;
    this.translations = translations.map(
      (translation) => new CategoryTranslationResponseDto(translation),
    );
    this.parentId = category.parentId;
    this.createdAt = category.createdAt;
    this.updatedAt = category.updatedAt;
  }
}

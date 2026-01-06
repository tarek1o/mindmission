import { CategoryModel } from '../../domain/models/category.model';
import { CategoryTranslationModel } from '../../domain/models/category-translation.model';

export interface CategoryWithTranslationsViewModel {
  category: CategoryModel;
  translations: CategoryTranslationModel[];
}

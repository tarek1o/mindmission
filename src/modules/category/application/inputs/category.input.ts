import { CategoryTranslationInput } from './category-translation.input';
import { CategoryTypeEnum } from '../../domain/enums/category-type.enum';

export interface CategoryInput {
  type: CategoryTypeEnum;
  parentId?: number | null;
  translations: CategoryTranslationInput[];
}

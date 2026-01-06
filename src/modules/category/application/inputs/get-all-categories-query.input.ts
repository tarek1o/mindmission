import { LanguageEnum } from 'src/modules/shared/domain/enums/language.enum';
import { CategoryTypeEnum } from '../../domain/enums/category-type.enum';

export interface GetAllCategoriesQueryInput {
  type: CategoryTypeEnum;
  language: LanguageEnum;
  name?: string;
}

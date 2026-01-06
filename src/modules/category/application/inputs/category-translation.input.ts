import { LanguageEnum } from 'src/modules/shared/domain/enums/language.enum';

export interface CategoryTranslationInput {
  language: LanguageEnum;
  name: string;
  description?: string;
}

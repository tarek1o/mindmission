import { LanguageEnum } from '../../../shared/domain/enums/language.enum';

export interface RoleTranslationInput {
  language: LanguageEnum;
  name: string;
  description?: string;
}

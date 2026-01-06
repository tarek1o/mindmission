import { LanguageEnum } from 'src/modules/shared/domain/enums/language.enum';

export interface GetRoleTranslationByNameViewModel {
  language: LanguageEnum;
  name: string;
}

import { LanguageEnum } from "src/modules/shared/domain/enums/language.enum";

export interface PermissionTranslationInput {
  language: LanguageEnum;
  name: string;
  description?: string;
}
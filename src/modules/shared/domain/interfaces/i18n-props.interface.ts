import { LanguageEnum } from "../enums/language.enum";

export interface I18nProps {
  [LanguageEnum.ENGLISH]: string;
  [LanguageEnum.ARABIC]: string;
}
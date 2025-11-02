import { LanguageEnum } from "../enums/language.enum";
import { I18nProps } from "../interfaces/i18n-props.interface";

export class I18nModel {
  [LanguageEnum.ENGLISH]: string;
  [LanguageEnum.ARABIC]: string;

  constructor(data: I18nProps) {
    this[LanguageEnum.ENGLISH] = data[LanguageEnum.ENGLISH];
    this[LanguageEnum.ARABIC] = data[LanguageEnum.ARABIC];
  }
}
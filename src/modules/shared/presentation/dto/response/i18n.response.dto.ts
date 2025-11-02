import { LanguageEnum } from "src/modules/shared/domain/enums/language.enum";
import { I18nModel } from "src/modules/shared/domain/models/i18n.model";

export class I18nResponseDto {
  [LanguageEnum.ENGLISH]: string;
  [LanguageEnum.ARABIC]: string;

  constructor(model: I18nModel) {
    this[LanguageEnum.ENGLISH] = model[LanguageEnum.ENGLISH];
    this[LanguageEnum.ARABIC] = model[LanguageEnum.ARABIC];
  }
}
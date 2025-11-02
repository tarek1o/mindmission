import { RoleTranslationModel } from "src/modules/role/domain/models/role-translation.model";
import { LanguageEnum } from "src/modules/shared/domain/enums/language.enum";

export class RoleTranslationResponseDto {
  language: LanguageEnum;
  name: string;
  description: string | null;

  constructor(roleTranslationViewModel: RoleTranslationModel) {
    this.language = roleTranslationViewModel.language;
    this.name = roleTranslationViewModel.name;
    this.description = roleTranslationViewModel.description;
  }
}
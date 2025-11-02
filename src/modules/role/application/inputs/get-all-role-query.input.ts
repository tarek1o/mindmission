import { LanguageEnum } from "../../../shared/domain/enums/language.enum";

export interface GetAllRoleQueryInput {
  language: LanguageEnum;
  name?: string;
}
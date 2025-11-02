import { LanguageEnum } from "../../../shared/domain/enums/language.enum";
import { ResourceEnum } from "../../domain/enums/resource.enum";

export interface GetAllPermissionQueryInput {
  language: LanguageEnum;
  name?: string;
  resource?: ResourceEnum;
}
import { LanguageEnum } from "../../../shared/domain/enums/language.enum";
import { PermissionTranslationModel } from "../../domain/models/permission-translation.model";
import { GetPermissionTranslationByLanguageViewModel } from "../view-models/get-permission-translation-by-language.view-model";
import { GetPermissionTranslationByNameViewModel } from "../view-models/get-permission-translation-by-name.view-model";

export interface IPermissionTranslationRepository {
  getByLanguage(language: LanguageEnum): Promise<GetPermissionTranslationByLanguageViewModel[]>;
  getByNameAndLanguageExcludingPermissionId(translations: {language: LanguageEnum, name: string}[], permissionId?: number): Promise<GetPermissionTranslationByNameViewModel[]>;
  saveMany(translations: PermissionTranslationModel[], manager?: unknown): Promise<PermissionTranslationModel[]>;
  deleteMany(translations: PermissionTranslationModel[], manager?: unknown): Promise<void>;
}

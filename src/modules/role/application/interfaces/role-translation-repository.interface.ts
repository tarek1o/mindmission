import { LanguageEnum } from '../../../shared/domain/enums/language.enum';
import { GetRoleTranslationByLanguageViewModel } from '../view-models/get-role-translation-by-language.view-model';
import { GetRoleTranslationByNameViewModel } from '../view-models/get-role-translation-by-name.view-model';
import { RoleTranslationModel } from '../../domain/models/role-translation.model';

export interface IRoleTranslationRepository {
  getByLanguage(
    language: LanguageEnum,
  ): Promise<GetRoleTranslationByLanguageViewModel[]>;
  getByNameAndLanguageExcludingRoleId(
    translations: { language: LanguageEnum; name: string }[],
    roleId?: number,
  ): Promise<GetRoleTranslationByNameViewModel[]>;
  saveMany(
    translations: RoleTranslationModel[],
    manager?: unknown,
  ): Promise<RoleTranslationModel[]>;
  deleteMany(
    translations: RoleTranslationModel[],
    manager?: unknown,
  ): Promise<void>;
}

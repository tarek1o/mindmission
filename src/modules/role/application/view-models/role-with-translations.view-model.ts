import { RoleModel } from '../../domain/models/role.model';
import { RoleTranslationModel } from '../../domain/models/role-translation.model';

export interface RoleWithTranslationsViewModel {
  role: RoleModel;
  translations: RoleTranslationModel[];
}

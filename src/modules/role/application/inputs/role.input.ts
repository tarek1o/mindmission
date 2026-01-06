import { RoleTranslationInput } from './role-translation.input';

export interface RoleInput {
  translations: RoleTranslationInput[];
  permissionIds: number[];
}

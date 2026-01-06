import { GetRoleTranslationByLanguageViewModel } from 'src/modules/role/application/view-models/get-role-translation-by-language.view-model';

export class RoleListResponseDto {
  id: number;
  name: string;

  constructor(roleTranslationViewModel: GetRoleTranslationByLanguageViewModel) {
    this.id = roleTranslationViewModel.roleId;
    this.name = roleTranslationViewModel.name;
  }
}

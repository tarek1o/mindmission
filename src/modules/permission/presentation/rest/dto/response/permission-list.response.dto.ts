import { GetPermissionTranslationByLanguageViewModel } from 'src/modules/permission/application/view-models/get-permission-translation-by-language.view-model';

export class PermissionTranslationListResponseDto {
  id: number;
  name: string;

  constructor(
    permissionTranslationModel: GetPermissionTranslationByLanguageViewModel,
  ) {
    this.id = permissionTranslationModel.permissionId;
    this.name = permissionTranslationModel.name;
  }
}

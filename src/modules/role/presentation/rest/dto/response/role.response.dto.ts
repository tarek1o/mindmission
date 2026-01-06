import { GetAllRolesByLanguageViewModel } from 'src/modules/role/application/view-models/get-all-roles-by-language.view-model';

export class RoleResponseDto {
  id: number;
  name: string;
  description: string;
  isDeletable: boolean;
  createdAt: Date;
  updateAt: Date;

  constructor(roleViewModel: GetAllRolesByLanguageViewModel) {
    this.id = roleViewModel.id;
    this.name = roleViewModel.name;
    this.description = roleViewModel.description;
    this.isDeletable = roleViewModel.isDeletable;
    this.createdAt = roleViewModel.createdAt;
    this.updateAt = roleViewModel.updatedAt;
  }
}

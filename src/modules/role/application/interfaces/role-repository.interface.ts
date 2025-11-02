import { GetAllRolesByLanguageViewModel } from '../view-models/get-all-roles-by-language.view-model';
import { GetAllRoleQueryInput } from '../inputs/get-all-role-query.input';
import { IOrder } from 'src/modules/shared/application/interfaces/order.interface';
import { AllowedRoleOrderColumnsEnum } from '../enums/allowed-role-order-columns.enum';
import { Pagination } from 'src/modules/shared/application/interfaces/pagination.interface';
import { RoleModel } from '../../domain/models/role.model';
import { RoleWithTranslationsViewModel } from '../view-models/role-with-translations.view-model';

export interface IRoleRepository {
  getAllPaginatedAndTotalCount(query: GetAllRoleQueryInput, order: IOrder<AllowedRoleOrderColumnsEnum>, pagination: Pagination): Promise<{ models: GetAllRolesByLanguageViewModel[], count: number }>;
  getById(id: number): Promise<RoleModel | null>;
  getByIds(ids: number[]): Promise<RoleModel[]>;
  getByIdWithTranslations(id: number): Promise<RoleWithTranslationsViewModel | null>;
  isSystemRoleExist(id: number): Promise<boolean>;
  countRolesWithPermissionsExcludingRoleId(permissionIds: number[], roleId?: number): Promise<number>;
  countUsersWithOnlyRole(roleId: number): Promise<number>
  save(permissionModel: RoleModel, manager?: unknown): Promise<RoleModel>;
}

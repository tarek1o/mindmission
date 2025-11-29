import { IBaseRepository } from 'src/modules/shared/application/interfaces/base-repository.interface';
import { Pagination } from 'src/modules/shared/application/interfaces/pagination.interface';
import { GetAllPermissionQueryInput } from '../inputs/get-all-permission-query.input';
import { IOrder } from 'src/modules/shared/application/interfaces/order.interface';
import { AllowedPermissionOrderColumnEnum } from '../enums/allowed-permission-order-columns.enum';
import { PermissionModel } from '../../domain/models/permission.model';
import { ResourceEnum } from '../../domain/enums/resource.enum';
import { ActionEnum } from '../../domain/enums/action.enum';
import { GetAllPermissionsByLanguageViewModel } from '../view-models/get-all-permissions-by-language.view.model';
import { PermissionWithTranslationsViewModel } from '../view-models/permission-with-translations.view-model';

export interface IPermissionRepository extends IBaseRepository<PermissionModel> {
  getAllPaginatedAndTotalCount(query: GetAllPermissionQueryInput, order: IOrder<AllowedPermissionOrderColumnEnum>, pagination: Pagination): Promise<{ models: GetAllPermissionsByLanguageViewModel[], count: number }>;
  getById(id: number): Promise<PermissionModel | null>;
  getWithTranslationsById(id: number): Promise<PermissionWithTranslationsViewModel | null>;
  getByIds(ids: number[]): Promise<PermissionModel[]>;
  getCountByResourceAndActions(resource: ResourceEnum, actions: ActionEnum[], permissionId?: number): Promise<number>;
  countRolesWithOnlyPermission(permissionId: number): Promise<number>
}

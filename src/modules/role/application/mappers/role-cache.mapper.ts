import { RoleModel } from 'src/modules/role/domain/models/role.model';
import { RoleCacheViewModel } from '../view-models/role-cache.view-model';

export abstract class RoleCacheMapper {
  static toCacheViewModel(model: RoleModel): RoleCacheViewModel {
    return {
      id: model.id,
      permissions: model.permissions.map(({ id }) => id),
      isDeletable: model.isDeletable,
    };
  }
}

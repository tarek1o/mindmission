import { PermissionModel } from 'src/modules/permission/domain/models/permission.model';
import { PermissionCacheViewModel } from '../view-models/permission-cache.view-model';

export abstract class PermissionCacheMapper {
  static toCacheViewModel(model: PermissionModel): PermissionCacheViewModel {
    return {
      id: model.id,
      resource: model.resource,
      actions: model.actions,
      level: model.level,
      isDeletable: model.isDeletable,
    };
  }
}

import { BaseCacheViewModel } from "src/modules/shared/application/view-models/base-cache.view-model";
import { ResourceEnum } from "src/modules/permission/domain/enums/resource.enum";
import { ActionEnum } from "src/modules/permission/domain/enums/action.enum";

export interface PermissionCacheViewModel extends BaseCacheViewModel {
  resource: ResourceEnum;
  actions: ActionEnum[];
  level: number;
  isDeletable: boolean;
}
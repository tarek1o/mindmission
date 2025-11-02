import { BaseCacheViewModel } from "src/modules/shared/application/view-models/base-cache.view-model";

export interface RoleCacheViewModel extends BaseCacheViewModel {
  permissions: number[];
  isDeletable: boolean;
}
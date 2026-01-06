import { IBaseCacheService } from 'src/modules/shared/application/interfaces/base-cache-service.interface';
import { PermissionCacheViewModel } from '../view-models/permission-cache.view-model';

export interface IPermissionCacheService extends IBaseCacheService<PermissionCacheViewModel> {}

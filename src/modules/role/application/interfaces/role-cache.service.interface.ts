import { IBaseCacheService } from 'src/modules/shared/application/interfaces/base-cache-service.interface';
import { RoleCacheViewModel } from '../view-models/role-cache.view-model';

export interface IRoleCacheService extends IBaseCacheService<RoleCacheViewModel> {}

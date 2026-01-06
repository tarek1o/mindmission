import { CacheIdType } from '../types/cache-id.type';
import { BaseCacheViewModel } from '../view-models/base-cache.view-model';

export interface IBaseCacheService<T extends BaseCacheViewModel> {
  getOne(id: CacheIdType): Promise<T | null>;
  getMany(ids: CacheIdType[]): Promise<T[]>;
  saveOne(model: T, ttl?: number): Promise<void>;
  saveMany(models: T[], ttl?: number): Promise<void>;
  deleteOne(id: CacheIdType): Promise<void>;
  deleteMany(ids: CacheIdType[]): Promise<void>;
  acquireLock(id: CacheIdType, ttl: number): Promise<boolean>;
}

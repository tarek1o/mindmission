import Redis from "ioredis";
import { IBaseCacheService } from "src/modules/shared/application/interfaces/base-cache-service.interface";
import { CacheIdType } from "src/modules/shared/application/types/cache-id.type";
import { BaseCacheViewModel } from "src/modules/shared/application/view-models/base-cache.view-model";

export abstract class BaseCacheService<T extends BaseCacheViewModel> implements IBaseCacheService<T> {
  constructor(
    protected prefix: string,
    protected client: Redis,
  ) {}

  protected buildKey(id: CacheIdType): string {
    return `${this.prefix}:${id}`;
  }

  protected parseValueToViewModel(value: string): T | null {
    return value ? JSON.parse(value) : null;
  }

  protected hasTTL(ttl?: number): boolean {
    return ttl !== null && ttl !== undefined;
  }

  protected parseValuesToViewModels(values: (string | null)[]): T[] {
    const viewModels: T[] = [];
    values.forEach(value => {
      if (value) {
        viewModels.push(this.parseValueToViewModel(value));
      }
    });
    return viewModels;
  }

  async getOne(id: CacheIdType): Promise<T | null> {
    const key = this.buildKey(id);
    const value = await this.client.get(key);
    return this.parseValueToViewModel(value);
  }

  async getMany(ids: CacheIdType[]): Promise<T[]> {
    const keys = ids.map(id => this.buildKey(id));
    const values = await this.client.mget(keys);
    return this.parseValuesToViewModels(values);
  }

  async saveOne(model: T, ttl?: number): Promise<void> {
    const prefixedKey = this.buildKey(model.id);
    const stringifiedValue = JSON.stringify(model);
    this.hasTTL(ttl) ? await this.client.set(prefixedKey, stringifiedValue, 'PX', ttl) : await this.client.set(prefixedKey, stringifiedValue);
  }

  async saveMany(models: T[], ttl?: number): Promise<void> {
    const pipeline = this.client.pipeline();
    models.forEach(model => {
      const key = this.buildKey(model.id);
      const value = JSON.stringify(model);
      this.hasTTL(ttl) ? pipeline.set(key, value, 'PX', ttl) : pipeline.set(key, value);
    });
    await pipeline.exec();
  }

  async deleteOne(id: CacheIdType): Promise<void> {
    const key = this.buildKey(id);
    await this.client.del(key);
  }

  async deleteMany(ids: CacheIdType[]): Promise<void> {
    const keys = ids.map(id => this.buildKey(id));
    await this.client.del(keys);
  }

  async acquireLock(id: CacheIdType, ttl: number): Promise<boolean> {
    const key = this.buildKey(id);
    const result = await this.client.set(key, key, 'PX', ttl, 'NX');
    return result === 'OK';
  }
}
import { Injectable } from "@nestjs/common";
import { InjectRedis } from "@nestjs-modules/ioredis";
import Redis from 'ioredis';
import { PermissionCacheViewModel } from "src/modules/permission/application/view-models/permission-cache.view-model";
import { BaseCacheService } from "src/modules/shared/infrastructure/cache/services/base-cache.service";
import { IPermissionCacheService } from "src/modules/permission/application/interfaces/permission-cache-service.interface";

@Injectable()
export class PermissionCacheService extends BaseCacheService<PermissionCacheViewModel> implements IPermissionCacheService {
  constructor(@InjectRedis() redis: Redis) {
    super('permissions', redis)
  }
}
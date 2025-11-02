import { Injectable } from "@nestjs/common";
import { InjectRedis } from "@nestjs-modules/ioredis";
import Redis from "ioredis";
import { BaseCacheService } from "src/modules/shared/infrastructure/cache/services/base-cache.service";
import { RoleCacheViewModel } from "../../../application/view-models/role-cache.view-model";
import { IRoleCacheService } from "src/modules/role/application/interfaces/role-cache.service.interface";

@Injectable()
export class RoleCacheService extends BaseCacheService<RoleCacheViewModel> implements IRoleCacheService {
  constructor(@InjectRedis() redis: Redis) {
    super('permissions', redis)
  }
}
import { Injectable } from "@nestjs/common";
import { InjectRedis } from "@nestjs-modules/ioredis";
import Redis from "ioredis";

@Injectable()
export class RedisConnectorService {
  constructor(@InjectRedis() public readonly connection: Redis) {}
}
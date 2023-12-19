import { SetMetadata } from "@nestjs/common";
import { DecoratorType } from "../interfaces/decorator.type";

const CacheRedis: DecoratorType = {
  metaName: "cache_redis",
  metaStateName: "cache_redis_state",
  metaData: (status = true) => SetMetadata("cache_redis", status),
};

export default CacheRedis;

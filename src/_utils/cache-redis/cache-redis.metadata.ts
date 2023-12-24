import { SetMetadata } from "@nestjs/common";
import { MetaDataType } from "../interfaces/metadata.type";

const CacheRedis: MetaDataType = {
  metaName: "cache_redis",
  metaStateName: "cache_redis_state",
  metaData: (status = true) => SetMetadata("cache_redis", status),
};

export default CacheRedis;

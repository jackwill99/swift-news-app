import { SetMetadata } from "@nestjs/common";
import { MetaDataType } from "../interfaces/metadata.type";

const CacheReset: MetaDataType = {
  metaName: "cache_reset",
  metaStateName: "cache_reset_state",
  /*
   Relevant resource url
   eg. /api/v1/sys/users => "users"
   eg. /api/v1/sys/users/1234 => "users:id"
   */
  metaData: (resourceEndPoints: string[]) =>
    SetMetadata("cache_reset", resourceEndPoints),
};

export default CacheReset;

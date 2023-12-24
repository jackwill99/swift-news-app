import { SetMetadata } from "@nestjs/common";
import { MetaDataType } from "../interfaces/metadata.type";
import { AccessLevel } from "./acl.enum";

/*
  Access Control Level
 */
export const AccessControl: MetaDataType = {
  metaName: "accessControl",
  metaStateName: "accessControlState",
  metaData: (...roles: AccessLevel[]) => SetMetadata("accessControl", roles),
};

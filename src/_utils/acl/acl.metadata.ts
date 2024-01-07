import { SetMetadata } from "@nestjs/common";
import { AccessLevel } from "./acl.enum";
import { MetaDataType } from "../interfaces/metadata.type";

/*
  Access Control Level
 */
export const AccessControl: MetaDataType = {
  metaName: "accessControl",
  metaStateName: "accessControlState",
  metaData: (...roles: AccessLevel[]) => SetMetadata("accessControl", roles)
};
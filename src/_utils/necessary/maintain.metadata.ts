import { SetMetadata } from "@nestjs/common";
import { MetaDataType } from "../interfaces/metadata.type";

const MaintainMode: MetaDataType = {
  metaName: "maintain",
  metaStateName: "maintainState",
  metaData: (status: boolean) => SetMetadata("maintain", status),
};

export default MaintainMode;

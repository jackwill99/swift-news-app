import { SetMetadata } from "@nestjs/common";
import { DecoratorType } from "../interfaces/decorator.type";

const MaintainMode: DecoratorType = {
  metaName: "maintain",
  metaStateName: "maintainState",
  metaData: (status: boolean) => SetMetadata("maintain", status),
};

export default MaintainMode;

import { CustomDecorator } from "@nestjs/common";

export type MetaDataType = {
  metaName: string;
  metaStateName: string;
  metaData: (...args: any[]) => CustomDecorator<string>;
};

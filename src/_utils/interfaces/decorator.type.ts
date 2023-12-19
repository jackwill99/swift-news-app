import { CustomDecorator } from "@nestjs/common";

export type DecoratorType = {
  metaName: string;
  metaStateName: string;
  metaData: (...args: any[]) => CustomDecorator<string>;
};

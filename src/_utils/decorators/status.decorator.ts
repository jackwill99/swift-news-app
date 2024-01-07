import { applyDecorators } from "@nestjs/common";
import { ApiProperty } from "@nestjs/swagger";
import { Transform } from "class-transformer";
import { IsInt, Max, Min } from "class-validator";
import { DecoratorParamType } from "../interfaces/decorator.param.type";

/*
    You can also combine some other decorators like `IsOptional()`
*/
export default function StatusDecorator(
  options: DecoratorParamType = new DecoratorParamType(),
) {
  return applyDecorators(
    Transform((param) => parseInt(param.value)),
    IsInt(),
    Min(0),
    Max(1),
    ApiProperty({
      required: options.requiredApiProperty,
      description: options.description ?? "Status must be 0 or 1",
      type: Number,
      example: options.example ?? 0,
    }),
  );
}

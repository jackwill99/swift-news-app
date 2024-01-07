import { applyDecorators } from "@nestjs/common";
import { ApiProperty } from "@nestjs/swagger";
import { Transform, Type } from "class-transformer";
import { IsArray, IsString } from "class-validator";
import { DecoratorParamType } from "../interfaces/decorator.param.type";

/*
    You can also combine some other decorators like `IsOptional()`
*/
export default function FilterByValueDecorator(
  options: DecoratorParamType = new DecoratorParamType(),
) {
  return applyDecorators(
    IsArray(),
    IsString({ each: true }),
    Type(() => String),
    Transform(({ value }): string[] =>
      value.split(",").filter((str) => !new RegExp("\\s+").test(str)),
    ),
    ApiProperty({
      required: options.requiredApiProperty,
      type: String,
      description: options.description ?? "Comma separated filter values",
      example: options.example ?? "Top,Daily,Favorite",
    }),
  );
}

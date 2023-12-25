import { applyDecorators } from "@nestjs/common";
import { ApiProperty } from "@nestjs/swagger";
import { Transform, Type } from "class-transformer";
import { IsArray, IsString } from "class-validator";

/*
    You can also combine some other decorators like `IsOptional()`
*/
export default function FilterByValueDecorator(
  requiredApiProperty: boolean = true,
  example?: string,
) {
  return applyDecorators(
    IsArray(),
    IsString({ each: true }),
    Type(() => String),
    Transform(({ value }) =>
      value
        .split(",")
        .filter((str) => str !== "" && str !== " ")
        .sort(),
    ),
    ApiProperty({
      required: requiredApiProperty,
      type: String,
      description: "Comma separated filter values",
      example: example ?? "Top,Daily,Favorite",
    }),
  );
}

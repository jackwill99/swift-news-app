import { applyDecorators } from "@nestjs/common";
import { ApiProperty } from "@nestjs/swagger";
import { Transform, Type } from "class-transformer";

// valid filter rules
const filterSort = ["+", "-"];

export class FilterValueBySort {
  operator: string;
  value: string;
}

/*
    You can also combine some other decorators like `IsOptional()`
*/
export default function FilterBySortDecorator(
  requiredApiProperty: boolean = true,
  example?: string,
) {
  return applyDecorators(
    Type(() => FilterValueBySort),
    Transform(({ value }): FilterValueBySort => {
      const operator = value[0];

      if (!filterSort.includes(operator)) {
        throw new Error("Only + / - operator support!");
      }

      return {
        operator: operator,
        value: value.substring(1, value.length),
      };
    }),
    ApiProperty({
      required: requiredApiProperty,
      type: String,
      description: "Sorted by value",
      example: example ?? "+price",
    }),
  );
}

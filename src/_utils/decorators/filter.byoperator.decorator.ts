import { applyDecorators } from "@nestjs/common";
import { ApiProperty } from "@nestjs/swagger";
import { Transform, Type } from "class-transformer";

// valid filter rules
const filterOperator = [
  "eq",
  "neq",
  "gt",
  "gte",
  "lt",
  "lte",
  "isnull",
  "isnotnull",
];

export class FilterValueByOperator {
  operator: string;
  value: string;
}

/*
    You can also combine some other decorators like `IsOptional()`
*/
export default function FilterByOperatorDecorator(
  requiredApiProperty: boolean = true,
  example?: string,
) {
  return applyDecorators(
    Type(() => FilterValueByOperator),
    Transform(({ value }): FilterValueByOperator => {
      const params = value.split(":");
      if (params[0] == undefined || params[1] == undefined) {
        throw new Error("Filtering is used full colon separated string.");
      }

      if (!filterOperator.includes(params[0])) {
        throw new Error("Invalid filtered operator");
      }
      return { operator: params[0], value: params[1] };
    }),
    ApiProperty({
      required: requiredApiProperty,
      type: String,
      description: "Full Colon separated filter by operator",
      example: example ?? "gt:100",
    }),
  );
}

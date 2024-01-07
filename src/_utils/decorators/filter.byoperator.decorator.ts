import { applyDecorators } from "@nestjs/common";
import { ApiProperty } from "@nestjs/swagger";
import { Transform, Type } from "class-transformer";
import { DecoratorParamType } from "../interfaces/decorator.param.type";

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
  options: DecoratorParamType = new DecoratorParamType(),
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

      if (new RegExp("\\s+").test(params[1])) {
        throw new Error("Whitespace does not allow");
      }

      return { operator: params[0], value: params[1] };
    }),
    ApiProperty({
      required: options.requiredApiProperty,
      type: String,
      description:
        options.description ?? "Full Colon separated filter by operator",
      example: options.example ?? "gt:100",
    }),
  );
}

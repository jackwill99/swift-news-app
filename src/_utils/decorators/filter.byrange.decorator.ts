import { applyDecorators } from "@nestjs/common";
import { ApiProperty } from "@nestjs/swagger";
import { Transform, Type } from "class-transformer";
import { DecoratorParamType } from "../interfaces/decorator.param.type";

const filterRange = ["in", "nin"];

export class FilterValueByRange {
  operator: string;
  from: string;
  to: string;
}

/*
    You can also combine some other decorators like `IsOptional()`
*/
export default function FilterByRangeDecorator(
  options: DecoratorParamType = new DecoratorParamType(),
) {
  return applyDecorators(
    Type(() => FilterValueByRange),
    Transform(({ value }): FilterValueByRange => {
      const params = value.split(":");
      if (
        params[0] == undefined ||
        params[1] == undefined ||
        params[2] == undefined
      ) {
        throw new Error("Filtering is used full colon separated string.");
      }

      if (!filterRange.includes(params[0])) {
        throw new Error("Invalid filtered range");
      }

      if (
        new RegExp("\\s+").test(params[1]) ||
        new RegExp("\\s+").test(params[2])
      ) {
        throw new Error("Whitespace does not allow");
      }

      return { operator: params[0], from: params[1], to: params[2] };
    }),
    ApiProperty({
      required: options.requiredApiProperty,
      type: String,
      description:
        options.description ?? "Full Colon separated filter by range",
      example: options.example ?? "in:from:to",
    }),
  );
}

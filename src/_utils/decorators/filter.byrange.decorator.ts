import { applyDecorators } from "@nestjs/common";
import { ApiProperty } from "@nestjs/swagger";
import { Transform, Type } from "class-transformer";

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
  requiredApiProperty: boolean = true,
  example?: string,
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
      return { operator: params[0], from: params[1], to: params[2] };
    }),
    ApiProperty({
      required: requiredApiProperty,
      type: String,
      description: "Full Colon separated filter by range",
      example: example ?? "in:from:to",
    }),
  );
}

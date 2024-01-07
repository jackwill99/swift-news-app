import { applyDecorators } from "@nestjs/common";
import { ApiProperty } from "@nestjs/swagger";
import { Transform, Type } from "class-transformer";
import { PipelineStage } from "mongoose";
import { DecoratorParamType } from "../interfaces/decorator.param.type";

// valid filter rules
const filterSort = ["+", "-"];

export class FilterValueBySort {
  operator: 1 | -1;
  value: string;
}

/*
    You can also combine some other decorators like `IsOptional()`
*/
export default function FilterBySortDecorator(
  options: DecoratorParamType = new DecoratorParamType(),
) {
  return applyDecorators(
    Type(() => FilterValueBySort),
    Transform(({ value }): FilterValueBySort[] => {
      const sorts = value
        .split(",")
        .filter((str) => !new RegExp("\\s+").test(str)) as string[];

      return sorts.map((sort) => {
        const operator = sort[0] as string;
        const keyword = sort.substring(1, sort.length);

        if (!filterSort.includes(operator)) {
          throw new Error(
            "Only + / - operator support in each comma separated value!",
          );
        }

        if (new RegExp("\\s+").test(keyword)) {
          throw new Error(
            "Whitespace does not allow in each comma separated value!",
          );
        }

        return {
          operator: operator === filterSort[0] ? -1 : 1,
          value: keyword,
        };
      });
    }),
    ApiProperty({
      required: options.requiredApiProperty,
      type: String,
      description: options.description ?? "Sorted by comma separated values",
      example: options.example ?? "+price",
    }),
  );
}

export function filterBySortAggregate(
  sorts?: FilterValueBySort[],
): PipelineStage {
  if (sorts == null || sorts.length == 0) {
    return {
      $sort: { createdAt: -1 },
    };
  } else {
    const sort = {};
    sorts.forEach((i) => {
      sort[i.value] = i.operator;
    });
    return {
      $sort: sort,
    };
  }
}

import { IsOptional } from "class-validator";
import FilterByValueDecorator from "../../../_utils/decorators/filter.byvalue.decorator";
import MongoIdDecorator from "../../../_utils/decorators/mongo.id.decorator";
import { PaginationDto } from "../../../_utils/dtos/pagination.dto";

export default class FilterNewsDto extends PaginationDto {
  @IsOptional()
  @FilterByValueDecorator({
    requiredApiProperty: false,
    example: "65868824b27cf9d1bd1bca64",
  })
  categories: string[] = [];

  @IsOptional()
  @MongoIdDecorator({ requiredApiProperty: false })
  country?: string;
}

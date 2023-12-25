import { IsOptional } from "class-validator";
import FilterByValueDecorator from "src/_utils/decorators/filter.byvalue.decorator";
import { PaginationDto } from "src/_utils/dtos/pagination.dto";

export default class FilterNewsDto extends PaginationDto {
  @IsOptional()
  @FilterByValueDecorator(false, "65868824b27cf9d1bd1bca64")
  categories: string[] = [];
}

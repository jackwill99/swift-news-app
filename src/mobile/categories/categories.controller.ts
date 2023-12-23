import { Controller, Get } from "@nestjs/common";
import { ApiOperation, ApiTags } from "@nestjs/swagger";
import { successResponse } from "src/_utils/necessary/response";
import { Public } from "../../_utils/necessary/public.decorator";
import { CategoriesService } from "./categories.service";

@ApiTags("Categories")
@Public(true)
@Controller()
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Get()
  @ApiOperation({ summary: "Get all of the categories" })
  async findAll() {
    const categories = await this.categoriesService.findAll();
    return successResponse("All of the categories", categories);
  }
}

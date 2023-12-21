import { Body, Controller, Get, Param } from "@nestjs/common";
import { ApiOperation, ApiTags } from "@nestjs/swagger";
import { errorResponse, successResponse } from "src/_utils/necessary/response";
import { Public } from "../../_utils/necessary/public.decorator";
import { CategoriesService } from "./categories.service";
import { UpdateCategoryDto } from "./dto/update-category.dto";

@ApiTags("Categories")
@Public(true)
@Controller()
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Get()
  @ApiOperation({ summary: "Get all of the categories" })
  async findAll() {
    const categories = await this.categoriesService.findAll();
    if (categories) {
      return successResponse("All of the categories", categories);
    } else {
      return errorResponse("Failed to get the all categories");
    }
  }

  // @Get(":id")
  findOne(@Param("id") id: string) {
    return this.categoriesService.findOne(+id);
  }

  // @Patch(":id")
  update(
    @Param("id") id: string,
    @Body() updateCategoryDto: UpdateCategoryDto,
  ) {
    return this.categoriesService.update(+id, updateCategoryDto);
  }

  // @Delete(":id")
  remove(@Param("id") id: string) {
    return this.categoriesService.remove(+id);
  }
}

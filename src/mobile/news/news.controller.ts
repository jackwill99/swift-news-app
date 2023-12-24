import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Query,
} from "@nestjs/common";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { PaginationDto } from "src/_utils/dtos/pagination.dto";
import { successResponse } from "src/_utils/necessary/response";
import { Public } from "../../_utils/necessary/public.metadata";
import { UpdateNewsDto } from "./dto/update-news.dto";
import { NewsService } from "./news.service";

@ApiTags("News")
@ApiBearerAuth("Authorization")
@Public(true)
@Controller()
export class NewsController {
  constructor(private readonly newsService: NewsService) {}

  @Get()
  async findAll(@Query() query: PaginationDto) {
    query.maxLimit = 15;
    query.process();
    query.allowsAll = false;
    const news = await this.newsService.findAll(query);
    return successResponse("News list query", news.data, news.meta);
  }

  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.newsService.findOne(+id);
  }

  @Patch(":id")
  update(@Param("id") id: string, @Body() updateNewsDto: UpdateNewsDto) {
    return this.newsService.update(+id, updateNewsDto);
  }

  @Delete(":id")
  remove(@Param("id") id: string) {
    return this.newsService.remove(+id);
  }
}

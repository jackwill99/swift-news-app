import { Controller, Get, Query } from "@nestjs/common";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { Public } from "../../_utils/necessary/public.metadata";
import { successResponse } from "../../_utils/necessary/response";
import FilterNewsDto from "./dto/filter-news.dto";
import { NewsService } from "./news.service";

@ApiTags("News")
@ApiBearerAuth("Authorization")
@Public(true)
@Controller()
export class NewsController {
  constructor(private readonly newsService: NewsService) {}

  @Get()
  async findAll(@Query() query: FilterNewsDto) {
    query.maxLimit = 15;
    query.process();
    query.allowsAll = false;
    const news = await this.newsService.findAll(query);
    return successResponse("News list query", news.data, news.meta);
  }
}

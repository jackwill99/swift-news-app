import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { PaginationDto } from "src/_utils/dtos/pagination.dto";
import { aggregateFacetOperation } from "src/_utils/necessary/schema.default";
import DBConnection from "../../constants/db";
import { CreateNewsDto } from "./dto/create-news.dto";
import { UpdateNewsDto } from "./dto/update-news.dto";
import { News } from "./entities/news.entity";

@Injectable()
export class NewsService {
  constructor(
    @InjectModel(News.name, DBConnection.coreDb) private newsModel: Model<News>,
  ) {}

  async create(createNewsDto: CreateNewsDto): Promise<News> {
    const news = await this.newsModel.create(createNewsDto);
    return news;
  }

  async findAll(pagination: PaginationDto): Promise<{
    data: any[];
    meta: { [key: string]: any };
  }> {
    const news = await this.newsModel.aggregate<{
      data: any[];
      meta: { [key: string]: any };
    }>([
      {
        $match: { status: 1, delete: 0 },
      },
      ...pagination.paginationAggregate(),
      {
        $facet: {
          data: [...aggregateFacetOperation()],
          count: [{ $count: "total" }],
        },
      },
      {
        $addFields: {
          count: {
            $ifNull: [{ $arrayElemAt: ["$count.total", 0] }, 0],
          },
        },
      },
      {
        $project: {
          data: 1,
          meta: {
            total: "$count",
          },
        },
      },
    ]);

    news[0].meta["page"] = pagination.page;
    news[0].meta["limit"] = pagination.limit;

    return news[0];
  }

  findOne(id: number) {
    return `This action returns a #${id} news`;
  }

  update(id: number, updateNewsDto: UpdateNewsDto) {
    return `This action updates a #${id} news`;
  }

  remove(id: number) {
    return `This action removes a #${id} news`;
  }
}

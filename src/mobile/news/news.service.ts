import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import mongoose, { Model } from "mongoose";
import { aggregateFacetOperation } from "src/_utils/necessary/schema.default";
import DBConnection from "../../constants/db";
import { CreateNewsDto } from "./dto/create-news.dto";
import FilterNewsDto from "./dto/filter-news.dto";
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

  async findAll(pagination: FilterNewsDto): Promise<{
    data: any[];
    meta: { [key: string]: any };
  }> {
    const categoriesFilter =
      pagination.categories.length > 0
        ? {
            categories: {
              $in: pagination.categories.map(
                (item) => new mongoose.Types.ObjectId(item),
              ),
            },
          }
        : {};

    const news = await this.newsModel.aggregate<{
      data: any[];
      meta: { [key: string]: any };
    }>([
      {
        $match: {
          status: 1,
          delete: 0,
          ...categoriesFilter,
        },
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
}

import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import DBConnection from "../../constants/db";
import { CategoriesModule } from "../categories/categories.module";
import { CountryModule } from "../country/country.module";
import { News, NewsSchema } from "./entities/news.entity";
import { NewsController } from "./news.controller";
import { NewsService } from "./news.service";

@Module({
  imports: [
    MongooseModule.forFeature(
      [{ name: News.name, schema: NewsSchema }],
      DBConnection.coreDb,
    ),
    CountryModule,
    CategoriesModule,
  ],
  controllers: [NewsController],
  providers: [NewsService],
  exports: [NewsService],
})
export class NewsModule {}

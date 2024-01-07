import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import DBConnection from "../../constants/db";
import { Category, CategorySchema } from "../../entities/category.entity";
import { CategoriesController } from "./categories.controller";
import { CategoriesService } from "./categories.service";

@Module({
  imports: [
    MongooseModule.forFeature(
      [{ name: Category.name, schema: CategorySchema }],
      DBConnection.coreDb,
    ),
  ],
  controllers: [CategoriesController],
  providers: [CategoriesService],
  exports: [CategoriesService],
})
export class CategoriesModule {}

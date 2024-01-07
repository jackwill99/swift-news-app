import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import DBConnection from "../../constants/db";
import { Category } from "../../entities/category.entity";
import { CreateCategoryDto } from "./dto/create-category.dto";

@Injectable()
export class CategoriesService {
  constructor(
    @InjectModel(Category.name, DBConnection.coreDb)
    private categoryModel: Model<Category>,
  ) {}

  async create(createCategoryDto: CreateCategoryDto): Promise<Category> {
    return await this.categoryModel.create(createCategoryDto);
  }

  async findAll(): Promise<Category[]> {
    const categories = await this.categoryModel.find<Category>({
      status: 1,
      delete: 0,
    });
    return categories;
  }

  async findOne(id: string): Promise<Category | null> {
    const category = await this.categoryModel.findById<Category>(id, null, {
      status: 1,
      delete: 0,
    });

    return category;
  }

  async findByName(name: string): Promise<Category | null> {
    const category = await this.categoryModel.find<Category>({
      name: name,
      status: 1,
      delete: 0,
    });

    if (category[0]) {
      return category[0];
    }
    return null;
  }
}

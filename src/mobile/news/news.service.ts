import { Injectable } from '@nestjs/common';
import { CreateNewsDto } from './dto/create-news.dto';
import { UpdateNewsDto } from './dto/update-news.dto';
import { Model } from 'mongoose';
import { News } from './entities/news.entity';
import { InjectModel } from '@nestjs/mongoose';
import DBConnection from '../../constants/db';
import { successResponse } from '../../_utils/necessary/response';

@Injectable()
export class NewsService {
  constructor(
    @InjectModel(News.name, DBConnection.coreDb) private newsModel: Model<News>,
  ) {
  }

  async create(createNewsDto: CreateNewsDto) {
    const news = await this.newsModel.create(createNewsDto);
    return successResponse('Successfully created news', news);
  }

  findAll() {
    return `This action returns all news`;
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

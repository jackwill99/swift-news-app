import { Module } from '@nestjs/common';
import { NewsService } from './news.service';
import { NewsController } from './news.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { News, NewsSchema } from './entities/news.entity';
import DBConnection from '../../constants/db';

@Module({
  imports: [
    MongooseModule.forFeature(
      [{ name: News.name, schema: NewsSchema }],
      DBConnection.coreDb,
    ),
  ],
  controllers: [NewsController],
  providers: [NewsService],
  exports: [NewsService],
})
export class NewsModule {
}

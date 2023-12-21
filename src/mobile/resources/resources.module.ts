import { Module } from '@nestjs/common';
import { ResourcesService } from './resources.service';
import { ResourcesController } from './resources.controller';
import { NewsModule } from '../news/news.module';
import { CategoriesModule } from '../categories/categories.module';
import { CountryModule } from '../country/country.module';

@Module({
  imports: [
    NewsModule,
    CategoriesModule,
    CountryModule,
  ],
  controllers: [ResourcesController],
  providers: [ResourcesService],
})
export class ResourcesModule {
}

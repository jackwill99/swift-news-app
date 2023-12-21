import { Module } from '@nestjs/common';
import { RouterModule } from '@nestjs/core';
import { UsersModule } from './users/users.module';
import { ResourcesModule } from './resources/resources.module';
import { NewsModule } from './news/news.module';
import { CategoriesModule } from './categories/categories.module';
import { CountryModule } from './country/country.module';

/*
  This is the collection of modules that is related with admin.
  Benefit is you can separate multiple swagger with specific module, and they are independent with each other
 */
export const mobileImports = [
  UsersModule,
  ResourcesModule,
  NewsModule,
  CategoriesModule,
  CountryModule,
];

@Module({
  imports: [
    ...mobileImports,
    RouterModule.register([
      {
        path: 'mobile',
        children: [
          {
            path: 'users',
            module: UsersModule,
          },
          {
            path: 'resource',
            module: ResourcesModule,
          },
          {
            path: 'news',
            module: NewsModule,
          },
          {
            path: 'categories',
            module: CategoriesModule,
          },
          {
            path: 'country',
            module: CountryModule,
          },
        ],
      },
    ]),

  ],
  controllers: [],
  providers: [],
})
export class MobileModule {
}

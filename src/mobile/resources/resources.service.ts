import { Injectable } from "@nestjs/common";
import * as process from "process";
import DBConnection from "../../constants/db";
import { Category } from "../../entities/category.entity";
import { Country } from "../../entities/country.entity";
import { CategoriesService } from "../categories/categories.service";
import { CreateCategoryDto } from "../categories/dto/create-category.dto";
import { CountryService } from "../country/country.service";
import { CreateCountryDto } from "../country/dto/create-country.dto";
import { CreateNewsDto } from "../news/dto/create-news.dto";
import { NewsService } from "../news/news.service";

@Injectable()
export class ResourcesService {
  constructor(
    private readonly newsService: NewsService,
    private readonly categoryService: CategoriesService,
    private readonly countryService: CountryService,
  ) {}

  private capitalize(str: string) {
    return str
      .split(" ")
      .map((e) => e[0].toUpperCase() + e.substring(1))
      .join(" ");
  }

  async takeAll() {
    const apiKey = process.env["NEWS_DATA_IO"];

    console.log(apiKey);
    await fetch(`${DBConnection.newsDataIo}${apiKey}`).then(
      async (response) => {
        const data = await response.json();
        const results = data["results"] as any[];

        console.log(results);
        for (const result of results) {
          const countryName = this.capitalize(result["country"][0]);

          let resultCountry: Country;
          const findCountry = await this.countryService.findByName(countryName);
          if (!findCountry) {
            const country = new CreateCountryDto();
            country.name = countryName;
            const countryResponse = await this.countryService.create(country);
            resultCountry = countryResponse;
          } else {
            resultCountry = findCountry;
          }

          const resultCategories: Category[] = [];
          for (const i of result["category"] as string[]) {
            const categoryName = this.capitalize(i);
            const findCategory =
              await this.categoryService.findByName(categoryName);

            if (!findCategory) {
              const category = new CreateCategoryDto();
              category.name = categoryName;
              const categoryResponse =
                await this.categoryService.create(category);
              resultCategories.push(categoryResponse);
            } else {
              resultCategories.push(findCategory);
            }
          }

          const news = new CreateNewsDto();
          news.title = result["title"];
          news.creator = result["creator"];
          news.link = result["link"];
          news.description = result["description"];
          news.content = result["content"];
          news.imgUrl = result["imgUrl"];
          news.pubDate = result["pubDate"];
          news.categories = resultCategories;
          news.country = resultCountry;
          await this.newsService.create(news);
        }
      },
    );

    return `Data are fetching and inserting into database. Don't call within 5 minutes for the next times.`;
  }
}

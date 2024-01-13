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

let nextPage: string | null = null;
let countryList: {
  code: string;
  name: string;
  path: string;
}[] = [];

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

  async fixAll() {}

  async takeAll() {
    let array = 5;

    for (let i = 0; i < array; i++) {
      await this.process();
    }

    return `Data are fetching and inserting into database. Don't call within 5 minutes for the next times.`;
  }

  private async process() {
    const apiKey = process.env["NEWS_DATA_IO"];

    if (countryList.length == 0) {
      await fetch("https://countrycode.org/api/countryCode/countryMenu").then(
        async (r) => {
          const results = await r.json();

          countryList = results;
        },
      );

      countryList.filter((i) => i.name == "United States")[0].name =
        "United States Of America";
      countryList.filter((i) => i.name == "Republic of the Congo")[0].name =
        "Dr Congo";
      countryList.filter((i) => i.name == "Bosnia and Herzegovina")[0].name =
        "Bosnia And Herzegovina";
      countryList.filter((i) => i.name == "Netherlands")[0].name = "Netherland";
    }

    const url = `${DBConnection.newsDataIo}${apiKey}${
      nextPage == null ? "" : `&page=${nextPage}`
    }`;
    await fetch(url).then(async (response) => {
      const data = await response.json();
      const results = data["results"] as any[];
      nextPage = data["nextPage"];

      for (const result of results) {
        const countryName = this.capitalize(result["country"][0]);

        let resultCountry: Country;
        const findCountry = await this.countryService.findByName(countryName);
        if (!findCountry) {
          const country = new CreateCountryDto();
          country.name = countryName;
          const countryCode = countryList.filter((i) => i.name == countryName);
          console.log(countryCode, countryName);
          country.code = countryCode[0].code.toUpperCase();
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
        news.imgUrl = result["image_url"];
        news.videoUrl = result["video_url"] ?? null;
        news.pubDate = result["pubDate"];
        news.categories = resultCategories;
        news.country = resultCountry;
        await this.newsService.create(news);
      }
    });
  }
}

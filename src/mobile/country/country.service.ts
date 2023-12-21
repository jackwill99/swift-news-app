import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import DBConnection from "../../constants/db";
import { CreateCountryDto } from "./dto/create-country.dto";
import { UpdateCountryDto } from "./dto/update-country.dto";
import { Country } from "./entities/country.entity";

@Injectable()
export class CountryService {
  constructor(
    @InjectModel(Country.name, DBConnection.coreDb)
    private countryModel: Model<Country>,
  ) {}

  async create(createCountryDto: CreateCountryDto): Promise<Country> {
    return await this.countryModel.create(createCountryDto);
  }

  findAll() {
    return `This action returns all country`;
  }

  findOne(id: number) {
    return `This action returns a #${id} country`;
  }

  async findByName(name: string): Promise<Country | null> {
    const country = await this.countryModel.find<Country>({ name: name });

    if (country[0]) {
      return country[0];
    }
    return null;
  }

  update(id: number, updateCountryDto: UpdateCountryDto) {
    return `This action updates a #${id} country`;
  }

  remove(id: number) {
    return `This action removes a #${id} country`;
  }
}

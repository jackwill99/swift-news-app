import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import DBConnection from "../../constants/db";
import { Country } from "../../entities/country.entity";
import { CreateCountryDto } from "./dto/create-country.dto";

@Injectable()
export class CountryService {
  constructor(
    @InjectModel(Country.name, DBConnection.coreDb)
    private countryModel: Model<Country>,
  ) {}

  async create(createCountryDto: CreateCountryDto): Promise<Country> {
    return await this.countryModel.create(createCountryDto);
  }

  async findAll(): Promise<Country[]> {
    const countries = await this.countryModel.find<Country>({
      status: 1,
      delete: 0,
    });
    return countries;
  }

  async findOne(id: string): Promise<Country | null> {
    const country = await this.countryModel.findById<Country>(id, null, {
      status: 1,
      delete: 0,
    });

    return country;
  }

  async findByName(name: string): Promise<Country | null> {
    const country = await this.countryModel.find<Country>({
      name: name,
      status: 1,
      delete: 0,
    });

    if (country[0]) {
      return country[0];
    }
    return null;
  }
}

import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import DBConnection from "../../constants/db";
import { Country, CountrySchema } from "../../entities/country.entity";
import { CountryController } from "./country.controller";
import { CountryService } from "./country.service";

@Module({
  imports: [
    MongooseModule.forFeature(
      [{ name: Country.name, schema: CountrySchema }],
      DBConnection.coreDb,
    ),
  ],
  controllers: [CountryController],
  providers: [CountryService],
  exports: [CountryService],
})
export class CountryModule {}

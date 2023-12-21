import { Module } from '@nestjs/common';
import { CountryService } from './country.service';
import { CountryController } from './country.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Country, CountrySchema } from './entities/country.entity';
import DBConnection from '../../constants/db';

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
export class CountryModule {
}

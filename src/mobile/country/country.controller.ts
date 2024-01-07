import { Controller, Get } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { Public } from "../../_utils/necessary/public.metadata";
import { successResponse } from "../../_utils/necessary/response";
import { CountryService } from "./country.service";

@ApiTags("Country")
@Public(true)
@Controller()
export class CountryController {
  constructor(private readonly countryService: CountryService) {}

  @Get()
  async findAll() {
    const countries = await this.countryService.findAll();
    return successResponse("All of the countries", countries);
  }
}

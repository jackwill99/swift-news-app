import { Controller, Get } from "@nestjs/common";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { successResponse } from "src/_utils/necessary/response";
import { Public } from "../../_utils/necessary/public.decorator";
import { CountryService } from "./country.service";

@ApiTags("Country")
@ApiBearerAuth("Authorization")
@Public(false)
@Controller()
export class CountryController {
  constructor(private readonly countryService: CountryService) {}

  @Get()
  async findAll() {
    const countries = await this.countryService.findAll();
    return successResponse("All of the countries", countries);
  }
}

import { Body, Controller, Delete, Get, Param, Patch } from '@nestjs/common';
import { CountryService } from './country.service';
import { UpdateCountryDto } from './dto/update-country.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Public } from '../../_utils/necessary/public.decorator';

@ApiTags('Country')
@ApiBearerAuth('Authorization')
@Public(false)
@Controller()
export class CountryController {
  constructor(private readonly countryService: CountryService) {
  }


  @Get()
  findAll() {
    return this.countryService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.countryService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCountryDto: UpdateCountryDto) {
    return this.countryService.update(+id, updateCountryDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.countryService.remove(+id);
  }
}

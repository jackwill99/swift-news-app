import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsArray, IsNotEmpty, IsString, ValidateNested } from "class-validator";
import { Category } from "../../../entities/category.entity";
import { Country } from "../../../entities/country.entity";
import { CreateCategoryDto } from "../../categories/dto/create-category.dto";
import { CreateCountryDto } from "../../country/dto/create-country.dto";

export class CreateNewsDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ type: String, required: true })
  title: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ type: String, required: true })
  link: string;

  @IsString()
  @ApiProperty({ type: String, isArray: true })
  creator?: string[];

  @IsString()
  @ApiProperty({ type: String })
  description?: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ type: String, required: true })
  content: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ type: Date, required: true })
  pubDate: Date;

  @IsString()
  @ApiProperty({ type: String })
  imgUrl?: string;

  @IsString()
  @ApiProperty({ type: String })
  videoUrl?: string;

  @IsArray({ each: true })
  @ValidateNested({ each: true })
  @Type(() => CreateCategoryDto)
  categories: Category[];

  @ValidateNested({ each: true })
  @Type(() => CreateCountryDto)
  country: Country;
}

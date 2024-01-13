import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";

export class CreateCountryDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ required: true, type: String })
  name: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ required: true, type: String })
  code: string;
}

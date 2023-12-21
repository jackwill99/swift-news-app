import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateCountryDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ required: true, type: String })
  name: string;
}

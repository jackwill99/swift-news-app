import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateCategoryDto {

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ required: true, type: String })
  name: string;

}

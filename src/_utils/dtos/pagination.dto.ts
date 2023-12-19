import { ApiProperty } from "@nestjs/swagger";
import { Transform } from "class-transformer";
import { IsNumber, IsOptional } from "class-validator";

export class PaginationDto {
  @IsOptional()
  @Transform((param) => parseInt(param.value))
  @IsNumber()
  @ApiProperty({ default: 1, type: Number })
  page = 1;

  @IsOptional()
  @Transform((param) => parseInt(param.value))
  @IsNumber()
  @ApiProperty({ default: 10, type: Number })
  limit = 5;
}

export class PaginationOrNotDto {
  @IsOptional()
  @Transform((param) => parseInt(param.value))
  @IsNumber()
  @ApiProperty({ required: false, type: Number })
  page: number | null;

  @IsOptional()
  @Transform((param) => parseInt(param.value))
  @IsNumber()
  @ApiProperty({ required: false, type: Number })
  limit: number | null;
}

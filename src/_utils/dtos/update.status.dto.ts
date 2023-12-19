import { ApiProperty } from "@nestjs/swagger";
import { Transform } from "class-transformer";
import {
  IsInt,
  IsMongoId,
  IsNotEmpty,
  IsString,
  Max,
  Min,
} from "class-validator";

export class UpdateStatusDto {
  @IsString()
  @IsNotEmpty()
  @IsMongoId()
  @ApiProperty({ type: String })
  id: string;

  @Transform((param) => parseInt(param.value))
  @IsInt()
  @Min(0)
  @Max(1)
  @ApiProperty({ description: "Status must be 0 or 1", type: Number })
  status: 0 | 1;
}

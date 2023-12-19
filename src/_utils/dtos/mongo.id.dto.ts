import { ApiProperty } from "@nestjs/swagger";
import { IsMongoId, IsNotEmpty, IsString } from "class-validator";

export class MongoIdDto {
  @IsString()
  @IsNotEmpty()
  @IsMongoId()
  @ApiProperty({
    type: String,
    description: "This must be mongodb object id",
  })
  id: string;
}

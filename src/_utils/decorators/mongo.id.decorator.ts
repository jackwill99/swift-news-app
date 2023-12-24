import { applyDecorators } from "@nestjs/common";
import { ApiProperty } from "@nestjs/swagger";
import {
  IsMongoId,
  IsNotEmpty,
  IsString,
} from "class-validator/types/decorator/decorators";

/*
    This custom decorator will be useful when mixing mongoId and other properties in your dtos.
    You don't need to extends `MongoIdDto` to take the decorators configuration.
*/
export default function mongoIdDecorator() {
  return applyDecorators(
    IsString(),
    IsNotEmpty(),
    IsMongoId(),
    ApiProperty({
      type: String,
      description: "This must be mongodb object id",
    }),
  );
}

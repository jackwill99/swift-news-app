import { applyDecorators } from "@nestjs/common";
import { ApiProperty } from "@nestjs/swagger";
import { IsMongoId, IsNotEmpty, IsString } from "class-validator";
import { DecoratorParamType } from "../interfaces/decorator.param.type";

/*
    This custom decorator will be useful when mixing mongoId and other properties in your dtos.
    You don't need to extends `MongoIdDto` to take the decorators configuration.
*/
export default function MongoIdDecorator(
  options: DecoratorParamType = new DecoratorParamType(),
) {
  return applyDecorators(
    IsString(),
    IsNotEmpty(),
    IsMongoId(),
    ApiProperty({
      required: options.requiredApiProperty,
      type: String,
      description: options.description ?? "This must be mongodb object id",
      example: options.example,
    }),
  );
}

import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ required: true, type: String, example: 'admin' })
  name: string;

  @IsString()
  @IsEmail()
  @IsNotEmpty()
  @ApiProperty({ required: true, type: String, example: 'admin@gmail.com' })
  email: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ required: true, type: String, example: 'admin123' })
  password: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ required: true, type: String, example: 'USER' })
  role: string;
}

import { Type } from 'class-transformer';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateVideoGameDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  productName: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  @Type(() => Number)
  price: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  @Type(() => Number)
  quantity: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  manufacture: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  releaseDate: string;

  @IsNotEmpty()
  @IsString()
  language: string;
}

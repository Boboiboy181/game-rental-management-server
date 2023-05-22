import { Type } from 'class-transformer';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { type } from 'os';

export class CreateVideoGameDto {
  @IsNotEmpty()
  @IsString()
  productName: string;

  @IsNotEmpty()
  @IsNumber()
  @Type(() => Number)
  price: number;

  @IsNotEmpty()
  @IsString()
  manufacture: string;

  @IsNotEmpty()
  @IsString()
  releaseDate: string;

  @IsNotEmpty()
  @IsString()
  language: string;
}

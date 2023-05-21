import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateVideoGameDto {
  @IsNotEmpty()
  @IsString()
  productName: string;

  @IsNotEmpty()
  @IsNumber()
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

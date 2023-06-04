import { Type } from 'class-transformer';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreatePreOrderDto {
  @IsNotEmpty()
  @IsString()
  customerName: string;

  @IsNotEmpty()
  @IsNumber()
  @Type(() => Number)
  numberOfRentalDays: number;

  @IsNotEmpty()
  rentedGames: [{ game: string; quantity: number }];
}

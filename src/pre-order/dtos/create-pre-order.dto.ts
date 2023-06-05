import { IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { RentalDaysEnum } from '../enums/rental-days.enum';

export class CreatePreOrderDto {
  @IsNotEmpty()
  @IsString()
  customerName: string;

  @IsNotEmpty()
  @IsEnum(RentalDaysEnum)
  numberOfRentalDays: RentalDaysEnum;

  @IsNotEmpty()
  rentedGames: [{ game: string; quantity: number }];
}

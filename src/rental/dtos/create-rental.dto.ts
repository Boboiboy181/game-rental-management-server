import { IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { RentalDaysEnum } from '../../pre-order/enums/rental-days.enum';

export class CreateRentalDto {
  @IsNotEmpty()
  @IsString()
  customerName: string;

  @IsNotEmpty()
  @IsEnum(RentalDaysEnum)
  numberOfRentalDays: RentalDaysEnum;

  @IsNotEmpty()
  rentedGames: [{ game: string; quantity: number }];

  @IsNotEmpty()
  deposit: number;
}

import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsNumberString,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';
import { RentalDaysEnum } from '../../pre-order/enums/rental-days.enum';

export class CreateRentalDto {
  @IsOptional()
  @IsString()
  customerId?: string;

  @IsNotEmpty()
  @IsNumberString()
  @MaxLength(10)
  @MinLength(10)
  phoneNumber: number;

  @IsNotEmpty()
  @IsString()
  customerName: string;

  @IsNotEmpty()
  @IsEnum(RentalDaysEnum)
  numberOfRentalDays: RentalDaysEnum;

  @IsNotEmpty()
  rentedGames: [{ gameId: string; quantity: number }];

  @IsNotEmpty()
  @IsNumber()
  deposit: number;
}

import {
  IsEnum,
  IsNotEmpty,
  IsNumberString,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';
import { RentalDaysEnum } from '../enums/rental-days.enum';

export class CreatePreOrderDto {
  @IsOptional()
  @IsString()
  customerID?: string;

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
  rentedGames: [{ gameID: string; preOrderQuantity: number }];
}

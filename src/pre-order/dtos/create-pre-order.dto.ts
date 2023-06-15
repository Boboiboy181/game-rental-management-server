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
import { ApiProperty } from '@nestjs/swagger';

export class CreatePreOrderDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  customerID?: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumberString()
  @MaxLength(10)
  @MinLength(10)
  phoneNumber: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  customerName: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsEnum(RentalDaysEnum)
  numberOfRentalDays: RentalDaysEnum;

  @ApiProperty()
  @IsNotEmpty()
  rentedGames: [{ gameID: string; preOrderQuantity: number }];
}

import {
  IsEmail,
  IsNotEmpty,
  IsNumberString,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreatePreOrderDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  customerID?: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsEmail()
  email: string;

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
  rentedGames: [
    {
      gameID: string;
      preOrderQuantity: number;
      numberOfRentalDays: string;
    },
  ];
}

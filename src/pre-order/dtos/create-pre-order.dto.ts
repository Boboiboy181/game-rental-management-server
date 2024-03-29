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
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiProperty()
  @IsOptional()
  @IsNumberString()
  @MaxLength(10)
  @MinLength(10)
  phoneNumber?: number;

  @ApiProperty()
  @IsOptional()
  @IsString()
  customerName?: string;

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

import {
  IsNotEmpty,
  IsNumber,
  IsNumberString,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateRentalDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  customerId?: string;

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

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  deposit: number;
}

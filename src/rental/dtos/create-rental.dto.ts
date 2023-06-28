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
import { Type } from 'class-transformer';

export class CreateRentalDto {
  @ApiPropertyOptional()
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
  @Type(() => Number)
  deposit: number;
}

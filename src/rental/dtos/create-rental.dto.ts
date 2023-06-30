import {
  IsNumber,
  IsNumberString,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class CreateRentalDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  preOrderID?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  customerID?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumberString()
  @MaxLength(10)
  @MinLength(10)
  phoneNumber?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  customerName?: string;

  @ApiPropertyOptional()
  @IsOptional()
  rentedGames?: [
    {
      gameID: string;
      preOrderQuantity: number;
      numberOfRentalDays: string;
    },
  ];

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  deposit?: number;
}

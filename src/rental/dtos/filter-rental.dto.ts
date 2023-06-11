import { ApiPropertyOptional } from '@nestjs/swagger';
import {
    IsNotEmpty,
    IsNumberString,
    IsOptional,
    IsString,
    MaxLength,
    MinLength,
  } from 'class-validator';
  
  export class FilterRentalDto {
    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    rentalId: string;
  
    @ApiPropertyOptional()
    @IsOptional()
    @IsNumberString()
    @MaxLength(10)
    @MinLength(10)
    phoneNumber?: number;
  
    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    customerName: string;
  
  }
  
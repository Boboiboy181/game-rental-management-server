import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsNumberString,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class FilterReturnDto {
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
}

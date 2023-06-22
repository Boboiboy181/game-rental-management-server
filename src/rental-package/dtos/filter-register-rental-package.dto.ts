import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsNumberString,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class FilterRegisterRentalPackageListDto {
  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  packageName?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  name?: string;

  @ApiPropertyOptional({ example: '0123456789' })
  @IsNumberString()
  @MaxLength(10)
  @MinLength(10)
  @IsOptional()
  phoneNumber?: string;
}

import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsNumberString,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class RegisterRentalPackageDto {
  @ApiProperty({ example: 'package 1' })
  @IsNotEmpty()
  @IsString()
  packageSearch: string;

  @ApiProperty({ example: '0123456789' })
  @IsNotEmpty()
  @IsNumberString()
  @MaxLength(10)
  @MinLength(10)
  customerSearch: number;
}

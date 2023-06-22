import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsNumber, IsOptional } from 'class-validator';

export class UpdateRegisterRentalPackageDto {
  @ApiPropertyOptional()
  @IsNumber()
  @IsOptional()
  numberOfGameRemaining: number;
}

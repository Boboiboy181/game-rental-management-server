import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsString } from 'class-validator';

export class UpdateVoucherDto {
  @ApiPropertyOptional({ description: 'Voucher code' })
  @IsOptional()
  @IsString()
  voucherCode?: string;

  @ApiPropertyOptional({ description: 'Voucher value' })
  @IsOptional()
  @IsNumber()
  voucherValue?: number;

  @ApiPropertyOptional({ description: 'Voucher point' })
  @IsOptional()
  @IsNumber()
  voucherPoint?: number;
}

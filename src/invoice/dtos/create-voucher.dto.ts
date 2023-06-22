import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class createInvoiceDtoVoucherDto {
  @ApiProperty({ description: 'Voucher name' })
  @IsNotEmpty()
  @IsString()
  voucherName: string;

  @ApiProperty({ description: 'Voucher code' })
  @IsNotEmpty()
  @IsString()
  voucherCode: string;

  @ApiProperty({ description: 'Voucher value' })
  @IsNotEmpty()
  @IsNumber()
  voucherValue: number;

  @ApiProperty({ description: 'Voucher point' })
  @IsNotEmpty()
  @IsNumber()
  pointRequired: number;
}

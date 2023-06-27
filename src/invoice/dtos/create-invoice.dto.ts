import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateInvoiceDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  returnTicketID: string;

  @ApiPropertyOptional()
  @IsOptional()
  voucherCodes?: string[];
}

import { IsNotEmpty, IsString } from 'class-validator';

export class CreateInvoiceDto {
  @IsNotEmpty()
  @IsString()
  returnTicketID: string;
}

import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { InvoiceService } from './invoice.service';
import { CreateInvoiceDto } from './dtos/create-invoice.dto';
import { UpdateInvoiceDto } from './dtos/update-invoice.dto';
import { Invoice } from './schemas/invoice.schema';

@Controller('invoice')
export class InvoiceController {
  constructor(private readonly invoiceService: InvoiceService) {}

  @Post()
  createInvoice(@Body() createInvoiceDto: CreateInvoiceDto) {
    return this.invoiceService.createInvoice(createInvoiceDto);
  }

  @Get()
  getInvoice() {
    return this.invoiceService.getInvoice();
  }

  @Get(':id')
  getInvoiceByID(@Param('id') id: string) {
    return this.invoiceService.getInvoiceByID(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateInvoiceDto: UpdateInvoiceDto,
  ): Promise<Invoice> {
    return this.invoiceService.updateInvoice(id, updateInvoiceDto);
  }

  @Delete(':id')
  async deleteInvoice(@Param('id') id: string): Promise<void> {
    await this.invoiceService.deleteInvoice(id);
  }
}

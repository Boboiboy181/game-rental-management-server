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
import {
  ApiCreatedResponse,
  ApiOkResponse,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

@ApiTags('invoice')
@Controller('invoice')
export class InvoiceController {
  constructor(private readonly invoiceService: InvoiceService) {}

  @Post()
  @ApiCreatedResponse({ type: Invoice })
  createInvoice(@Body() createInvoiceDto: CreateInvoiceDto): Promise<Invoice> {
    return this.invoiceService.createInvoice(createInvoiceDto);
  }

  @Get()
  @ApiOkResponse({ type: [Invoice] })
  getInvoice(): Promise<Invoice[]> {
    return this.invoiceService.getInvoice();
  }

  @Get(':id')
  @ApiOkResponse({ type: Invoice })
  getInvoiceByID(@Param('id') id: string): Promise<Invoice> {
    return this.invoiceService.getInvoiceByID(id);
  }

  @Patch(':id')
  @ApiOkResponse({ type: Invoice })
  updateInvoice(
    @Param('id') id: string,
    @Body() updateInvoiceDto: UpdateInvoiceDto,
  ): Promise<Invoice> {
    return this.invoiceService.updateInvoice(id, updateInvoiceDto);
  }

  @Delete(':id')
  @ApiResponse({ status: 204, description: 'Delete success' })
  deleteInvoice(@Param('id') id: string): Promise<void> {
    return this.invoiceService.deleteInvoice(id);
  }
}

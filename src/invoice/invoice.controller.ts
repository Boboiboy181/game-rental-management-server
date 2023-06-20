import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  BadRequestException,
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
  createInvoice(@Body() createInvoiceDto: CreateInvoiceDto) {
    return this.invoiceService.createInvoice(createInvoiceDto);
  }

  @Get()
  @ApiOkResponse({ type: [Invoice] })
  getInvoice() {
    return this.invoiceService.getInvoice();
  }

  @Get(':id')
  @ApiOkResponse({ type: Invoice })
  getInvoiceByID(@Param('id') id: string) {
    return this.invoiceService.getInvoiceByID(id);
  }

  @Patch(':id')
  @ApiOkResponse({ type: Invoice })
  update(
    @Param('id') id: string,
    @Body() updateInvoiceDto: UpdateInvoiceDto,
  ): Promise<Invoice> {
    return this.invoiceService.updateInvoice(id, updateInvoiceDto);
  }

  @Delete(':id')
  @ApiResponse({ status: 204, description: 'Delete success' })
  async deleteInvoice(@Param('id') id: string): Promise<void> {
    await this.invoiceService.deleteInvoice(id);
  }
  @Post('/redeem-voucher')

  async redeemVoucher(
  @Body('customerId') customerId: string,
  @Body('voucherPoints') voucherId: string,
): Promise<void> {
  try {
    await this.invoiceService.subtractPoint(customerId, voucherId);
    // Logic xử lý thêm sau khi trừ điểm thành công
    return;
  } catch (error) {
    // Xử lý lỗi nếu có
    throw new BadRequestException(error.message);
  }
}
}

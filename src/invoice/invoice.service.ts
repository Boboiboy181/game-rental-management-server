import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateInvoiceDto } from './dtos/create-invoice.dto';
import { UpdateInvoiceDto } from './dtos/update-invoice.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Invoice } from './schemas/invoice.schema';
import { ReturnService } from 'src/return/return.service';
import { PaymentStateEnum } from 'src/return/enum/payment-state.enum';

@Injectable()
export class InvoiceService {
  constructor(
    @InjectModel('Invoice') private readonly invoiceModel: Model<Invoice>,
    private readonly returnService: ReturnService,
  ) {}

  async createInvoice(createInvoiceDto: CreateInvoiceDto): Promise<Invoice> {
    const { returnTicketID } = createInvoiceDto;
    const returnTicket = await this.returnService.getReturnTicketById(
      returnTicketID,
    );
    const invoice = new this.invoiceModel({
      customer: returnTicket.customer,
      rentedGames: returnTicket.rentedGames,
      fine: returnTicket.fine,
      finalPrice: returnTicket.estimatedPrice,
    });

    await this.returnService.updateReturnTicket(returnTicketID, {
      paymentState: PaymentStateEnum.PAID,
    });

    return await invoice.save();
  }

  findAll() {
    return `This action returns all invoice`;
  }

  async getInvoiceByID(id: string): Promise<Invoice> {
    const result = await this.invoiceModel.findById(id).exec();
    if (!result) {
      throw new NotFoundException(`Could not find invoice with ${id}`);
    }
    return result;
  }

  async updateInvoice(
    id: string,
    updateInvoiceDto: UpdateInvoiceDto,
  ): Promise<Invoice> {
    const updated = await this.invoiceModel.findByIdAndUpdate(
      id,
      updateInvoiceDto,
      { new: true },
    );
    if (!updated) {
      throw new NotFoundException('Invoice not found');
    }
    return updated;
  }

  async deleteInvoice(id: string): Promise<void> {
    const result = await this.getInvoiceByID(id);
    if (!result) {
      throw new NotFoundException(`Could not find invoice with ${id}`);
    }
    await this.invoiceModel.deleteOne({ _id: id }).exec();
  }
}

import { Injectable } from '@nestjs/common';
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

  async create(createInvoiceDto: CreateInvoiceDto): Promise<Invoice> {
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

    if (invoice.finalPrice === returnTicket.estimatedPrice) {
      await this.returnService.updateReturnTicket(returnTicketID, {
        paymentState: PaymentStateEnum.PAID,
      });
    }

    return await invoice.save();
  }

  findAll() {
    return `This action returns all invoice`;
  }

  async getInvoiceByID(id: string) {
    return 'This action returns a #${id} invoice';
  }

  update(id: number, updateInvoiceDto: UpdateInvoiceDto) {
    return `This action updates a #${id} invoice`;
  }

  remove(id: number) {
    return `This action removes a #${id} invoice`;
  }
}

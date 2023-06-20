import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateInvoiceDto } from './dtos/create-invoice.dto';
import { UpdateInvoiceDto } from './dtos/update-invoice.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Invoice } from './schemas/invoice.schema';
import { ReturnService } from 'src/return/return.service';
import { PaymentStateEnum } from 'src/return/enum/payment-state.enum';
import { Customer } from 'src/customer/schemas/customer.schema';
import { RedeemVoucherDto } from './dtos/redeem-voucher.dto';

@Injectable()
export class InvoiceService {
  constructor(
    @InjectModel('Invoice') private readonly invoiceModel: Model<Invoice>,
    @InjectModel('Customer') private readonly customerModel: Model<Customer>,
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
      // fine: returnTicket.fine,
      finalPrice: returnTicket.estimatedPrice,
    });
    await this.returnService.updateReturnTicket(returnTicketID, {
      paymentState: PaymentStateEnum.PAID,
    });
    // await this.addPoint(returnTicket.customer.toString(),returnTicket.estimatedPrice)
    return await invoice.save();
  }

  async getInvoice(): Promise<Invoice[]> {
    const result = await this.invoiceModel.find().exec();
    if (!result) {
      throw new NotFoundException(`Could not find invoice `);
    }
    return result;
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

  async addPoint(customerId: string, transactionAmount: number): Promise<void> {
    // Logic tính tiền giao dịch hóa đơn hiện tại

    // Logic cộng điểm tích lũy
    const customer = await this.customerModel.findById(customerId);

    if (!customer) {
      throw new Error('Customer with id ${id} not found');
    }

    const pointsEarned = Math.floor(transactionAmount / 10000); // Ví dụ: Mỗi 10,000 VNĐ giao dịch tích 1 điểm

    customer.point += pointsEarned;
    await customer.save();
  }

  async subtractPoint(customerId: string, voucherpoint: number): Promise<void> {
    // Logic trừ điểm theo voucher hiện tại

    // Logic trừ điểm tích lũy
    const customer = await this.customerModel.findById(customerId);

    if (!customer) {
      throw new Error('Customer with id ${id} not found');
    }
    voucherpoint = 2; // GIả sử voucher point =2
    if (customer.point < voucherpoint) {
      throw new Error(`Insufficient points for voucher redemption`);
    }
    customer.point -= voucherpoint;
    await customer.save();
  }

  //  async redeemVoucher(redeemvoucherdto:RedeemVoucherDto): Promise<void> {
  //    const{code,customerId}=redeemvoucherdto;
  //    const result = await this.voucherModel.findOne({
  //    voucherCode:code,
  //    }).exec();
  //    if (!result):
  //     throw new NotFoundException(`Wrong voucher code`);
  //    await this.subtractPoint(customerId.toString(),result.redeemedPoint)

  //  }
}

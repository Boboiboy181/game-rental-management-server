import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateInvoiceDto } from './dtos/create-invoice.dto';
import { UpdateInvoiceDto } from './dtos/update-invoice.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Invoice } from './schemas/invoice.schema';
import { ReturnService } from 'src/return/return.service';
import { PaymentStateEnum } from 'src/return/enum/payment-state.enum';
import { CustomerService } from '../customer/customer.service';
import { Voucher } from './schemas/voucher.schema';
import { UpdateVoucherDto } from './dtos/update-voucher.dto';

@Injectable()
export class InvoiceService {
  constructor(
    @InjectModel('Invoice') private readonly invoiceModel: Model<Invoice>,
    @InjectModel('Voucher') private readonly voucherModel: Model<Voucher>,
    private readonly customerService: CustomerService,
    private readonly returnService: ReturnService,
  ) {}

  async addPoint(customerId: string, transactionAmount: number): Promise<void> {
    const customer = await this.customerService.getCustomerById(customerId);
    if (!customer) {
      throw new Error('Customer with id ${id} not found');
    }
    // Logic cộng điểm tích lũy
    const pointsEarned = Math.floor(transactionAmount / 10000); // Ví dụ: Mỗi 10,000 VNĐ giao dịch tích 1 điểm

    await this.customerService.updateCustomer(customerId, {
      point: customer.point + pointsEarned,
    });
  }

  async subtractPoint(
    customerId: string,
    voucherCodes: string[],
  ): Promise<void> {
    const customer = await this.customerService.getCustomerById(customerId);
    if (!customer) {
      throw new Error('Customer with id ${id} not found');
    }
    const totalVoucherPoint = await voucherCodes.reduce(
      async (acc: Promise<number>, voucherCode: string) => {
        const voucher = await this.getVoucherByCode(voucherCode);
        const voucherPoint = voucher.pointRequired;
        const previousValue = await acc;
        return previousValue + voucherPoint;
      },
      Promise.resolve(0),
    );
    // Logic trừ điểm tích lũy
    if (customer.point < totalVoucherPoint) {
      throw new Error(`Insufficient points for voucher redemption`);
    }
    await this.customerService.updateCustomer(customerId, {
      point: customer.point - totalVoucherPoint,
    });
  }

  async getVoucherByCode(code: string): Promise<Voucher> {
    const result = await this.voucherModel
      .findOne({ voucherCode: code })
      .exec();
    if (!result) {
      throw new NotFoundException(`Could not find voucher with ${code}`);
    }
    return result;
  }

  async updateVoucher(
    id: string,
    updateVoucherDto: UpdateVoucherDto,
  ): Promise<Voucher> {
    const updated = await this.voucherModel.findByIdAndUpdate(
      id,
      updateVoucherDto,
      { new: true },
    );
    if (!updated) {
      throw new NotFoundException('Voucher not found');
    }
    return updated;
  }

  async deleteVoucher(id: string): Promise<void> {
    const result = await this.voucherModel.findById(id).exec();
    if (!result) {
      throw new NotFoundException(`Could not find voucher with ${id}`);
    }
    await this.invoiceModel.deleteOne({ _id: id }).exec();
  }

  async createInvoice(createInvoiceDto: CreateInvoiceDto): Promise<Invoice> {
    const { returnTicketID, voucherCodes } = createInvoiceDto;
    const returnTicket = await this.returnService.getReturnTicketById(
      returnTicketID,
    );
    const invoice = new this.invoiceModel({
      customer: returnTicket.customer,
      rentedGames: returnTicket.rentedGames,
      return: returnTicket,
    });
    await this.returnService.updateReturnTicket(returnTicketID, {
      paymentState: PaymentStateEnum.PAID,
    });

    if (voucherCodes) {
      const totalVoucherValue = await voucherCodes.reduce(
        async (acc: Promise<number>, voucherCode: string) => {
          const voucher = await this.getVoucherByCode(voucherCode);
          invoice.voucher.push(voucher);
          const voucherValue = voucher.voucherValue;
          const previousValue = await acc;
          return previousValue + voucherValue;
        },
        Promise.resolve(0),
      );
      // subtract point from customer
      await this.subtractPoint(returnTicket.customer.toString(), voucherCodes);
      // price with voucher
      invoice.finalPrice =
        returnTicket.estimatedPrice * (1 - totalVoucherValue * 0.01);
    } else {
      invoice.finalPrice = returnTicket.estimatedPrice;
    }

    // adding point to customer
    await this.addPoint(
      returnTicket.customer.toString(),
      returnTicket.estimatedPrice,
    );
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
}

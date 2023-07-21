import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateInvoiceDto } from './dtos/create-invoice.dto';
import { UpdateInvoiceDto } from './dtos/update-invoice.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Invoice, InvoiceDocument } from './schemas/invoice.schema';
import { ReturnService } from 'src/return/return.service';
import { PaymentStateEnum } from 'src/return/enum/payment-state.enum';
import { CustomerService } from '../customer/customer.service';
import { Voucher } from './schemas/voucher.schema';
import { UpdateVoucherDto } from './dtos/update-voucher.dto';
import { createInvoiceDtoVoucherDto } from './dtos/create-voucher.dto';
import { RentalPackageService } from '../rental-package/rental-package.service';
import { AutoCodeService } from '../auto-code/auto-code.service';
import { MailerService } from '@nestjs-modules/mailer';
import { formatDate } from '../utils/format-date';

@Injectable()
export class InvoiceService {
  constructor(
    @InjectModel('Invoice') private readonly invoiceModel: Model<Invoice>,
    @InjectModel('Voucher') private readonly voucherModel: Model<Voucher>,
    private readonly customerService: CustomerService,
    private readonly returnService: ReturnService,
    private readonly rentalPackageService: RentalPackageService,
    private readonly autoCodeService: AutoCodeService,
    private readonly mailerService: MailerService,
  ) {}

  async addPoint(customerId: string, transactionAmount: number): Promise<void> {
    const customer = await this.customerService.getCustomerById(customerId);
    if (!customer) {
      throw new Error('Customer with id ${id} not found');
    }
    // Logic cộng điểm tích lũy
    const pointsEarned = Math.floor(transactionAmount / 10000); // Ví dụ: Mỗi 10,000 VNĐ giao dịch tích 5 điểm

    await this.customerService.updateCustomer(customerId, {
      point: customer.point + pointsEarned,
    });
  }

  async subtractPoint(customerId: string, voucherCode: string): Promise<void> {
    const customer = await this.customerService.getCustomerById(customerId);
    if (!customer) {
      throw new Error('Customer with id ${id} not found');
    }
    const voucher = await this.getVoucherByCode(voucherCode);
    if (!voucher) {
      throw new Error('Voucher with code ${voucherCode} not found');
    }
    const voucherPoint = voucher.pointRequired;
    // Logic trừ điểm tích lũy
    if (customer.point < voucherPoint) {
      throw new Error(`Insufficient points for voucher redemption`);
    }
    await this.customerService.updateCustomer(customerId, {
      point: customer.point - voucherPoint,
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

  async createVoucher(
    createVoucherDto: createInvoiceDtoVoucherDto,
  ): Promise<Voucher> {
    const { voucherCode } = createVoucherDto;
    const voucher = await this.getVoucherByCode(voucherCode);
    if (voucher) {
      throw new Error(`Voucher with code ${voucherCode} already exists`);
    }
    const createdVoucher = new this.voucherModel(createVoucherDto);
    return await createdVoucher.save();
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

  async checkRegisterRentalPackage(
    customerID: string,
    rentedGames,
    createInvoceAt: Date,
  ): Promise<boolean> {
    const result = await this.rentalPackageService.getRegistrationByCustomerID(
      customerID,
    );
    if (result.length === 0) return false;

    const latestRegisterRentalPackage = result[0];

    // Check if the registration is still valid
    const isDateValid =
      latestRegisterRentalPackage.registrationEndDate >= createInvoceAt;

    if (!isDateValid) return false;

    const numberOfRentedGames = rentedGames.reduce((acc, game) => {
      return acc + game.preOrderQuantity;
    }, 0);

    // Check if the number of games is still valid
    const remainingGame =
      latestRegisterRentalPackage.numberOfGameRemaining - numberOfRentedGames;
    const isQuantityValid = remainingGame > 0;

    if (!isQuantityValid) return false;

    await this.rentalPackageService.updateRegistration(
      latestRegisterRentalPackage,
      {
        numberOfGameRemaining: remainingGame,
      },
    );

    return isDateValid && isQuantityValid;
  }

  async createInvoice(createInvoiceDto: CreateInvoiceDto): Promise<Invoice> {
    const { returnTicketID, voucherCode } = createInvoiceDto;
    const returnTicket = await this.returnService.getReturnTicketById(
      returnTicketID,
    );

    const invoice = new this.invoiceModel({
      invoiceID: await this.autoCodeService.generateAutoCode('ISE'),
      customer: returnTicket.customer,
      rentedGames: returnTicket.rentedGames,
      return: returnTicket,
    });

    const registrationValid = await this.checkRegisterRentalPackage(
      returnTicket.customer._id.toString(),
      returnTicket.rentedGames,
      new Date(),
    );

    await this.returnService.updateReturnTicket(returnTicketID, {
      paymentState: PaymentStateEnum.PAID,
    });

    if (voucherCode) {
      const voucher = await this.getVoucherByCode(voucherCode);

      invoice.voucher = voucher;

      const voucherValue = voucher.voucherValue;
      // subtract point from customer
      await this.subtractPoint(
        returnTicket.customer._id.toString(),
        voucherCode,
      );
      // price with voucher
      invoice.finalPrice =
        returnTicket.estimatedPrice * (1 - voucherValue * 0.01);
    } else if (registrationValid) {
      invoice.finalPrice = 0;
      const registration =
        await this.rentalPackageService.getRegistrationByCustomerID(
          returnTicket.customer._id.toString(),
        );
      const latestRegistration = registration[0];
      const numberOfRentedGames = returnTicket.rentedGames.reduce(
        (acc, game) => {
          return acc + game.preOrderQuantity;
        },
        0,
      );
      const remainingGame =
        latestRegistration.numberOfGameRemaining - numberOfRentedGames;
      await this.rentalPackageService.updateRegistration(latestRegistration, {
        numberOfGameRemaining: remainingGame,
      });
    } else {
      invoice.finalPrice = returnTicket.estimatedPrice;
    }

    // adding point to customer
    await this.addPoint(
      returnTicket.customer._id.toString(),
      returnTicket.estimatedPrice,
    );

    const invoiceDocument: InvoiceDocument = await invoice.save();

    await this.mailerService.sendMail({
      to: invoiceDocument.customer.email,
      subject: 'Receipt',
      template: './invoice-checked',
      context: {
        invoiceID: invoiceDocument.invoiceID,
        customerName: invoiceDocument.customer.customerName,
        email: invoiceDocument.customer.email,
        phoneNumber: invoiceDocument.customer.phoneNumber,
        rentedGames: returnTicket.rentedGames.map((game) => {
          return {
            name: game.game.productName,
            quantity: game.preOrderQuantity,
            price: game.game.price,
            rentalDays: game.numberOfRentalDays,
            returnDate: formatDate(game.returnDate.toString()),
          };
        }),
        totalPrice: invoiceDocument.finalPrice,
      },
    });

    return invoiceDocument;
  }

  async getInvoice(): Promise<Invoice[]> {
    const result = await this.invoiceModel
      .find()
      .populate('customer', 'customerName phoneNumber point')
      .populate('rentedGames.game', 'productName price')
      .populate('return', 'returnCode')
      .sort({ createdAt: -1 })
      .exec();
    if (!result) {
      throw new NotFoundException(`Could not find invoice `);
    }
    return result;
  }

  async getInvoiceByID(id: string): Promise<InvoiceDocument> {
    const result = await this.invoiceModel
      .findById(id)
      .populate('customer', 'customerName point email phoneNumber')
      .populate('rentedGames.game', 'productName price')
      .populate('return', 'returnCode')
      .populate('voucher', 'voucherName voucherCode voucherValue')
      .exec();

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
    const result: InvoiceDocument = await this.getInvoiceByID(id);
    if (!result) {
      throw new NotFoundException(`Could not find invoice with ${id}`);
    }

    // update return ticket status
    await this.returnService.updateReturnTicket(result.return._id.toString(), {
      paymentState: PaymentStateEnum.NOT_PAID,
    });

    const { voucher } = result;
    if (voucher) {
      await this.customerService.updateCustomer(
        result.customer._id.toString(),
        {
          point: result.customer.point + voucher.pointRequired,
        },
      );
    }

    // subtract point from customer based on the estimatedPrice
    const returnTicket = await this.returnService.getReturnTicketById(
      result.return._id.toString(),
    );
    const { estimatedPrice } = returnTicket;
    const pointsEarned = Math.floor(estimatedPrice / 10000);

    await this.customerService.updateCustomer(result.customer._id.toString(), {
      point: returnTicket.customer.point - pointsEarned,
    });

    // update remaining game if the customer registration is still valid
    const isRegistered = await this.checkRegisterRentalPackage(
      result.customer._id.toString(),
      result.rentedGames,
      new Date(),
    );
    if (isRegistered) {
      const registration =
        await this.rentalPackageService.getRegistrationByCustomerID(
          result.customer._id.toString(),
        );
      const latestRegistration = registration[0];
      const numberOfRentedGames = result.rentedGames.reduce((acc, game) => {
        return acc + game.preOrderQuantity;
      }, 0);
      const remainingGame =
        latestRegistration.numberOfGameRemaining + numberOfRentedGames;
      await this.rentalPackageService.updateRegistration(latestRegistration, {
        numberOfGameRemaining: remainingGame,
      });
    }

    await this.invoiceModel.deleteOne({ _id: id }).exec();
  }
}

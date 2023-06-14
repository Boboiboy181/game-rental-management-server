import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateReturnDto } from './dtos/create-return.dto';
import { UpdateReturnDto } from './dtos/update-return.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Return } from './schemas/return.schema';
import { Customer } from 'src/customer/schemas/customer.schema';
import { RentalService } from 'src/rental/rental.service';
import { PaymentStateEnum } from './enum/payment-state.enum';
import { VideoGameService } from 'src/video-game/video-game.service';
import { RentalDaysEnum } from 'src/pre-order/enums/rental-days.enum';
import { ReturnStateEnum } from 'src/rental/enums/return-state.enum';
import { FilterReturnDto } from './dtos/filter-return.dto';

@Injectable()
export class ReturnService {
  constructor(
    @InjectModel('Return') private readonly returnlModel: Model<Return>,
    @InjectModel('Customer') private readonly customerModel: Model<Customer>,
    private readonly rentalService: RentalService,
    private readonly videoGameService: VideoGameService,
  ) {}

  async createReturnTicket(createReturnDto: CreateReturnDto): Promise<Return> {
    const { rentalId, rentedGames } = createReturnDto;

    const rental = await this.rentalService.getRentalById(rentalId);

    const returnTicket = new this.returnlModel({
      paymentState: PaymentStateEnum.NOT_PAID,
      rental,
      customer: rental.customer,
      numberOfRentalDays: rental.numberOfRentalDays,
      deposit: rental.deposit,
      returnDate: rental.returnDate,
    });
    // caculate the overdue days
    const daysPastDue =
      new Date(Date.now()).getDate() - rental.returnDate.getDate();
    returnTicket.daysPastDue = daysPastDue;

    const totalGamesPrice = rentedGames.map(async (rentedGame) => {
      const { gameId, quantity } = rentedGame;

      // find game
      const videoGame = await this.videoGameService.getVideoGameById(gameId);
      // add game and update quantity

      returnTicket.rentedGames.push({ game: videoGame, quantity });
      await this.videoGameService.updateProduct(gameId, {
        quantity: videoGame.quantity + quantity,
      });

      return videoGame.price * quantity;
    });

    const totalPrice = (await Promise.all(totalGamesPrice)).reduce(
      (acc, price) => acc + price,
      0,
    );

    switch (returnTicket.numberOfRentalDays) {
      case RentalDaysEnum.ONE_DAY:
        returnTicket.estimatedPrice = totalPrice;
        break;
      case RentalDaysEnum.THREE_DAYS:
        returnTicket.estimatedPrice = totalPrice * 0.85;
        break;
      case RentalDaysEnum.SEVEN_DAYS:
        returnTicket.estimatedPrice = totalPrice * 0.85;
        break;
      case RentalDaysEnum.THIRTY_DAYS:
        returnTicket.estimatedPrice = totalPrice * 0.83;
        break;
      case RentalDaysEnum.SIXTY_DAYS:
        returnTicket.estimatedPrice = totalPrice * 0.8;
        break;
      default:
        rental.estimatedPrice = totalPrice;
        break;
    }

    returnTicket.fine = Math.floor(returnTicket.daysPastDue * 0.1 * totalPrice);

    if (returnTicket.estimatedPrice === rental.estimatedPrice) {
      this.rentalService.updateRental(rentalId, {
        returnState: ReturnStateEnum.RETURNED,
      });
    } else if (returnTicket.estimatedPrice > 0) {
      this.rentalService.updateRental(rentalId, {
        returnState: ReturnStateEnum.NOT_ENOUGH,
      });
    }

    return await returnTicket.save();
  }

  async getReturnTicket(filterReturnDto: FilterReturnDto): Promise<Return[]> {
    const { phoneNumber, name } = filterReturnDto;
    const query = this.returnlModel.find();
    query.setOptions({ lean: true });

    if (name) {
      const customer = await this.customerModel.findOne({
        customerName: { $regex: name, $options: 'i' },
      });
      if (!customer) {
        throw new NotFoundException(
          `Return form with customer's name: ${name} not found`,
        );
      }
      const customer_id: string = customer._id.toHexString();
      query.where('customer').equals(customer_id);
    }
    if (phoneNumber) {
      const customer = await this.customerModel.findOne({
        phoneNumber: { $regex: phoneNumber, $options: 'i' },
      });
      if (!customer) {
        throw new NotFoundException(
          `Return form with customer's phone number: ${phoneNumber} not found`,
        );
      }
      const customer_id: string = customer._id.toHexString();
      query.where('customer').equals(customer_id);
    }
    const results = await query.exec();
    if (results.length === 0) {
      throw new NotFoundException(
        `Rental Package Registeration cannot be found`,
      );
    }
    return results;
  }

  async getReturnTicketById(id: string): Promise<Return> {
    const returnTicket = await this.returnlModel.findById(id).exec();
    if (!returnTicket) {
      throw new Error(`Return ticket with ${id} not found`);
    }
    return returnTicket;
  }

  async updateReturnTicket(
    id: string,
    updateReturnDto: UpdateReturnDto,
  ): Promise<Return> {
    const updated = await this.returnlModel.findByIdAndUpdate(
      id,
      updateReturnDto,
      { new: true },
    );

    if (!updated) {
      throw new NotFoundException(`Return ticket with ${id} not found`);
    }
    return updated;
  }

  async deleteReturnTicket(id: string): Promise<void> {
    const result = await this.getReturnTicketById(id);
    if (!result) {
      throw new NotFoundException(`Return ticket with id ${id} not found`);
    }
    await this.returnlModel.deleteOne({ _id: id }).exec();
  }
}

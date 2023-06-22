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
      deposit: rental.deposit,
    });

    const pricePerGame = rentedGames.map(async (rentedGame) => {
      const { gameID, preOrderQuantity } = rentedGame;

      // find game
      const videoGame = await this.videoGameService.getVideoGameById(gameID);

      const gameToBeReturned = rental.rentedGames.filter(
        (rentedGame) => rentedGame.game.toString() === gameID,
      );

      const numberOfRentalDays = gameToBeReturned[0].numberOfRentalDays;
      const returnDate = gameToBeReturned[0].returnDate;

      const daysPastDue = Math.floor(
        (Date.now() - returnDate.getTime()) / (1000 * 3600 * 24),
      );

      let returnFine = 0;
      if (daysPastDue > 0) {
        returnFine = Math.floor(daysPastDue * 0.1 * videoGame.price);
      }

      // add game and update quantity
      returnTicket.rentedGames.push({
        game: videoGame,
        preOrderQuantity,
        numberOfRentalDays,
        returnDate,
        daysPastDue,
        fine: returnFine,
      });
      await this.videoGameService.updateProduct(gameID, {
        quantity: videoGame.quantity + preOrderQuantity,
      });

      // calculate price per game
      let videoGamePrice: number = videoGame.price;
      switch (numberOfRentalDays) {
        case 1:
          videoGamePrice = videoGame.price;
          break;
        case 3:
          videoGamePrice = videoGame.price * 0.89;
          break;
        case 7:
          videoGamePrice = videoGame.price * 0.87;
          break;
        case 14:
          videoGamePrice = videoGame.price * 0.85;
          break;
        case 30:
          videoGamePrice = videoGame.price * 0.83;
          break;
        case 60:
          videoGamePrice = videoGame.price * 0.8;
          break;
        default:
          break;
      }

      return (
        videoGamePrice * preOrderQuantity * numberOfRentalDays + returnFine
      );
    });

    const totalPrice = (await Promise.all(pricePerGame)).reduce(
      (acc, price) => acc + price,
      0,
    );
    returnTicket.estimatedPrice = totalPrice;

    const { returnValue } = rental;
    const updateReturnValue = returnValue + totalPrice;
    await this.rentalService.updateRental(rentalId, {
      returnValue: updateReturnValue,
    });

    if (updateReturnValue >= rental.estimatedPrice) {
      await this.rentalService.updateRental(rentalId, {
        returnState: ReturnStateEnum.RETURNED,
      });
    } else {
      await this.rentalService.updateRental(rentalId, {
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
    const updated = await this.returnlModel
      .findByIdAndUpdate(id, updateReturnDto, { new: true })
      .exec();

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

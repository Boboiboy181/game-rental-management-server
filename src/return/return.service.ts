import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateReturnDto } from './dtos/create-return.dto';
import { UpdateReturnDto } from './dtos/update-return.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Return, ReturnDocument } from './schemas/return.schema';
import { Customer } from 'src/customer/schemas/customer.schema';
import { RentalService } from 'src/rental/rental.service';
import { PaymentStateEnum } from './enum/payment-state.enum';
import { VideoGameService } from 'src/video-game/video-game.service';
import { ReturnStateEnum } from 'src/rental/enums/return-state.enum';
import { FilterReturnDto } from './dtos/filter-return.dto';
import { priceByDays } from 'src/utils/price-by-days';
import { AutoCodeService } from '../auto-code/auto-code.service';
import { RentalDocument } from '../rental/schemas/rental.schema';

@Injectable()
export class ReturnService {
  constructor(
    @InjectModel('Return') private readonly returnlModel: Model<Return>,
    @InjectModel('Customer') private readonly customerModel: Model<Customer>,
    private readonly rentalService: RentalService,
    private readonly videoGameService: VideoGameService,
    private readonly autoCodeService: AutoCodeService,
  ) {}

  async createReturnTicket(createReturnDto: CreateReturnDto): Promise<Return> {
    const { rentalId, rentedGames } = createReturnDto;

    const rental = await this.rentalService.getRentalById(rentalId);

    const returnTicket = new this.returnlModel({
      returnCode: await this.autoCodeService.generateAutoCode('RSE'),
      rentalCode: rental.rentalCode,
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
        (rentedGame) => rentedGame.game.productName === videoGame.productName,
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

      // calculate price by days
      const videoGamePrice = priceByDays(videoGame.price, numberOfRentalDays);

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

    const returnDocument: ReturnDocument = await returnTicket.save();

    await this.rentalService.updateRental(rentalId, {
      returnIDs: [...rental.returnIDs, returnDocument._id.toString()],
    });

    return returnDocument;
  }

  async getReturnTicket(filterReturnDto: FilterReturnDto): Promise<Return[]> {
    const { phoneNumber, name } = filterReturnDto;
    const query = this.returnlModel.find();
    query.setOptions({ lean: true });
    query.populate('customer', 'customerName phoneNumber');
    query.populate('rentedGames.game', 'productName price');
    query.sort({ createdAt: -1 });
    return await query.exec();
  }

  async getReturnTicketById(id: string): Promise<Return> {
    const returnTicket = await this.returnlModel
      .findById(id)
      .populate('customer', 'customerName email phoneNumber point')
      .populate('rentedGames.game', 'productName price')
      .exec();
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
      .populate('customer', 'customerName phoneNumber')
      .populate('rentedGames.game', 'productName price')
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

    const rental: RentalDocument =
      await this.rentalService.getRentalByRentalCode(result.rentalCode);

    let countValue = 0;
    const { rentedGames } = result;
    for (const rentedGame of rentedGames) {
      const { game, preOrderQuantity } = rentedGame;
      countValue +=
        priceByDays(game.price, rentedGame.numberOfRentalDays) *
          preOrderQuantity +
        rentedGame.fine;
      const videoGame = await this.videoGameService.getVideoGameById(
        game._id.toString(),
      );
      await this.videoGameService.updateProduct(game._id.toString(), {
        quantity: videoGame.quantity - preOrderQuantity,
      });
    }
    // update rental
    await this.rentalService.updateRental(rental._id.toString(), {
      returnState:
        rental.returnIDs.filter((returnID) => returnID !== id).length === 0
          ? ReturnStateEnum.NOT_RETURNED
          : ReturnStateEnum.NOT_ENOUGH,
      returnIDs: rental.returnIDs.filter((returnID) => returnID !== id),
      returnValue: rental.returnValue - countValue,
    });

    await this.returnlModel.deleteOne({ _id: id }).exec();
  }
}

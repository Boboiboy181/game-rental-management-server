import { Injectable } from '@nestjs/common';
import { CreateReturnDto } from './dtos/create-return.dto';
import { UpdateReturnDto } from './dtos/update-return.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Return } from './schemas/return.schema';
import { RentalService } from 'src/rental/rental.service';
import { PaymentStateEnum } from './enum/payment-state.enum';
import { VideoGameService } from 'src/video-game/video-game.service';
import { RentalDaysEnum } from 'src/pre-order/enums/rental-days.enum';
import { ReturnStateEnum } from 'src/rental/enums/return-state.enum';

@Injectable()
export class ReturnService {
  constructor(
    @InjectModel('Return') private readonly returnlModel: Model<Return>,
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

  findAll() {
    return `This action returns all return`;
  }

  async getReturnTicketById(id: string): Promise<Return> {
    const returnTicket = await this.returnlModel.findById(id).exec();
    if (!returnTicket) {
      throw new Error(`Return ticket with ${id} not found`);
    }
    return returnTicket;
  }

  update(id: number, updateReturnDto: UpdateReturnDto) {
    return `This action updates a #${id} return`;
  }

  remove(id: number) {
    return `This action removes a #${id} return`;
  }
}

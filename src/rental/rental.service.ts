import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateRentalDto } from './dtos/create-rental.dto';
import { UpdateRentalDto } from './dtos/update-rental.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Rental } from './schemas/rental.schema';
import { RentalDaysEnum } from '../pre-order/enums/rental-days.enum';
import { VideoGameService } from '../video-game/video-game.service';
import { CustomerService } from '../customer/customer.service';
import { ReturnStateEnum } from './enums/return-state.enum';
import { FilterRentalDto } from './dtos/filter-rental.dto';

@Injectable()
export class RentalService {
  constructor(
    @InjectModel('Rental') private readonly rentalModel: Model<Rental>,
    private readonly videoGameService: VideoGameService,
    private readonly customerService: CustomerService,
  ) {}

  async createRental(createRentalDto: CreateRentalDto): Promise<Rental> {
    const { customerId, phoneNumber, customerName, rentedGames, deposit } =
      createRentalDto;
    // find customer
    const customer = await this.customerService.getCustomerById(customerId, {
      customerName,
      phoneNumber,
    });
    // create new rental
    const rental = new this.rentalModel({
      customer,
      deposit,
      returnState: ReturnStateEnum.NOT_RETURNED,
    });
    // find games and calculate total price
    const pricePerGame = rentedGames.map(async (rentedGame) => {
      const { gameID, preOrderQuantity, numberOfRentalDays } = rentedGame;
      // find game
      const videoGame = await this.videoGameService.getVideoGameById(gameID);

      const returnDate = new Date(Date.now());
      returnDate.setDate(
        returnDate.getDate() + RentalDaysEnum[numberOfRentalDays],
      );

      // add game and update quantity
      if (
        videoGame.quantity >= preOrderQuantity &&
        preOrderQuantity > 0 &&
        videoGame.quantity > 0
      ) {
        rental.rentedGames.push({
          game: videoGame,
          preOrderQuantity,
          numberOfRentalDays: RentalDaysEnum[numberOfRentalDays],
          returnDate,
        });
        await this.videoGameService.updateProduct(gameID, {
          quantity: videoGame.quantity - preOrderQuantity,
        });
      } else {
        throw new BadRequestException(
          `Game ${videoGame.productName} is out of stock`,
        );
      }

      // calculate price per game
      let videoGamePrice: number = videoGame.price;
      switch (numberOfRentalDays) {
        case 'ONE_DAY':
          videoGamePrice = videoGame.price;
          break;
        case 'THREE_DAYS':
          videoGamePrice = videoGame.price * 0.89;
          break;
        case 'SEVEN_DAYS':
          videoGamePrice = videoGame.price * 0.87;
          break;
        case 'FOURTEEN_DAYS':
          videoGamePrice = videoGame.price * 0.85;
          break;
        case 'THIRTY_DAYS':
          videoGamePrice = videoGame.price * 0.83;
          break;
        case 'SIXTY_DAYS':
          videoGamePrice = videoGame.price * 0.8;
          break;
        default:
          break;
      }

      return (
        videoGamePrice * preOrderQuantity * RentalDaysEnum[numberOfRentalDays]
      );
    });

    const totalPrice = (await Promise.all(pricePerGame)).reduce(
      (acc, price) => acc + price,
      0,
    );
    rental.estimatedPrice = totalPrice;

    return await rental.save();
  }

  async getRental(filterRentaldto: FilterRentalDto): Promise<Rental[]> {
    const { phoneNumber, customerName } = filterRentaldto;
    const query = this.rentalModel.find();
    query.setOptions({ lean: true });
    if (customerName) {
      query.where({ customerName: { $regex: customerName, $options: 'i' } });
    }
    if (phoneNumber) {
      query.where({ phoneNumber: { $regex: phoneNumber, $options: 'i' } });
    }
    return await query.exec();
  }

  async getRentalById(id: string): Promise<Rental> {
    const result = await this.rentalModel.findById(id).exec();
    if (!result) {
      throw new NotFoundException(`Rental with id ${id} not found`);
    }
    return result;
  }

  async updateRental(
    id: string,
    updateRentalDto: UpdateRentalDto,
  ): Promise<Rental> {
    const updated = await this.rentalModel.findByIdAndUpdate(
      id,
      updateRentalDto,
      { new: true },
    );

    if (!updated) {
      throw new NotFoundException(`Rental with id ${id} not found`);
    }
    return updated;
  }

  async deleteRental(id: string): Promise<void> {
    const result = await this.getRentalById(id);
    if (!result) {
      throw new NotFoundException(`Rental with id ${id} not found`);
    }
    await this.rentalModel.deleteOne({ _id: id }).exec();
  }
}

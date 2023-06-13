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
import { Customer } from 'src/customer/schemas/customer.schema';

@Injectable()
export class RentalService {
  constructor(
    @InjectModel('Rental') private readonly rentalModel: Model<Rental>,
    @InjectModel('Customer') private readonly customerModel: Model<Customer>,
    private readonly videoGameService: VideoGameService,
    private readonly customerService: CustomerService,
  ) {}

  async createRental(createRentalDto: CreateRentalDto): Promise<Rental> {
    const {
      customerId,
      phoneNumber,
      customerName,
      rentedGames,
      numberOfRentalDays,
      deposit,
    } = createRentalDto;
    // find customer
    const customer = await this.customerService.getCustomerById(customerId, {
      customerName,
      phoneNumber,
    });
    // create new rental
    const rental = new this.rentalModel({
      customer,
      numberOfRentalDays: RentalDaysEnum[numberOfRentalDays],
      deposit,
      returnState: ReturnStateEnum.NOT_RETURNED,
    });
    // find games and calculate total price
    const totalGamesPrice = rentedGames.map(async (rentedGame) => {
      const { gameId, quantity } = rentedGame;
      // find game
      const videoGame = await this.videoGameService.getVideoGameById(gameId);
      // add game and update quantity

      if (
        videoGame.quantity >= quantity &&
        quantity > 0 &&
        videoGame.quantity > 0
      ) {
        rental.rentedGames.push({ game: videoGame, quantity });
        await this.videoGameService.updateProduct(gameId, {
          quantity: videoGame.quantity - quantity,
        });
      } else {
        throw new BadRequestException(
          `Game ${videoGame.productName} is out of stock`,
        );
      }
      return videoGame.price * quantity;
    });

    const totalPrice = (await Promise.all(totalGamesPrice)).reduce(
      (acc, price) => acc + price,
      0,
    );

    // calculate return date
    const returnDate = new Date(Date.now());
    returnDate.setDate(returnDate.getDate() + rental.numberOfRentalDays);
    rental.returnDate = returnDate;

    // calculate estimated price
    switch (rental.numberOfRentalDays) {
      case RentalDaysEnum.ONE_DAY:
        rental.estimatedPrice = totalPrice;
        break;
      case RentalDaysEnum.THREE_DAYS:
        rental.estimatedPrice = totalPrice * 0.85;
        break;
      case RentalDaysEnum.SEVEN_DAYS:
        rental.estimatedPrice = totalPrice * 0.85;
        break;
      case RentalDaysEnum.THIRTY_DAYS:
        rental.estimatedPrice = totalPrice * 0.83;
        break;
      case RentalDaysEnum.SIXTY_DAYS:
        rental.estimatedPrice = totalPrice * 0.8;
        break;
      default:
        rental.estimatedPrice = totalPrice;
        break;
    }
    return await rental.save();
  }

  async getRental(filterRentaldto: FilterRentalDto): Promise<Rental[]> {
    const { phoneNumber, name } = filterRentaldto;
    const query = this.rentalModel.find();
    query.setOptions({ lean: true });
    if (name) {
      const customer = await this.customerModel.findOne({
        customerName: { $regex: name, $options: 'i' },
       });
       console.log(customer)
       if (!customer) {
         throw new NotFoundException(`Rental Form with customer's name: ${name} not found`);
       }
       const customer_id: string = customer._id.toHexString();
       query.where('customer').equals(customer_id);
     }
    if (phoneNumber) {
      const customer = await this.customerModel.findOne({
        phoneNumber: { $regex: phoneNumber, $options: 'i' },
      });
      if (!customer) {
        throw new NotFoundException(`Rental Form with customer's name: ${phoneNumber} not found`);
      }
      const customerid: string = customer._id.toHexString();
      query.where('customer').equals(customerid);
    }
   // Sẽ tìm package name có trong CSDL KH

   const results = await query.exec();
   if(results.length === 0){
     throw new NotFoundException(`Rental Form cannot be found`);
   }
   return results;
  }

  async getRentalById(id: string): Promise<Rental> {
    const result = await this.rentalModel.findById(id).exec();
    if (!result) {
      throw new Error(`Rental with id ${id} not found`);
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

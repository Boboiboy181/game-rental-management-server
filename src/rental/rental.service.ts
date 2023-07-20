import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateRentalDto } from './dtos/create-rental.dto';
import { UpdateRentalDto } from './dtos/update-rental.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Rental, RentalDocument } from './schemas/rental.schema';
import { RentalDaysEnum } from '../pre-order/enums/rental-days.enum';
import { VideoGameService } from '../video-game/video-game.service';
import { CustomerService } from '../customer/customer.service';
import { ReturnStateEnum } from './enums/return-state.enum';
import { FilterRentalDto } from './dtos/filter-rental.dto';
import { PreOrderService } from '../pre-order/pre-order.service';
import { priceByDays } from 'src/utils/price-by-days';
import { AutoCodeService } from '../auto-code/auto-code.service';
import { MailerService } from '@nestjs-modules/mailer';
import { VideoGameDocument } from '../video-game/schemas/video-game.schema';

@Injectable()
export class RentalService {
  constructor(
    @InjectModel('Rental') private readonly rentalModel: Model<Rental>,
    private readonly videoGameService: VideoGameService,
    private readonly customerService: CustomerService,
    private readonly preOrderService: PreOrderService,
    private readonly autoCodeService: AutoCodeService,
    private readonly mailerService: MailerService,
  ) {}

  async createRental(createRentalDto: CreateRentalDto): Promise<Rental> {
    const {
      customerID,
      email,
      phoneNumber,
      customerName,
      rentedGames,
      deposit,
      preOrderID,
    } = createRentalDto;

    if (preOrderID) {
      return await this.createRentalFromPreOrder(preOrderID);
    }

    // find customer
    const customer = await this.customerService.getCustomerById(customerID, {
      email,
      customerName,
      phoneNumber,
    });
    // create new rental
    const rental = new this.rentalModel({
      rentalCode: await this.autoCodeService.generateAutoCode('SE'),
      customer,
      deposit,
      returnValue: 0,
      returnState: ReturnStateEnum.NOT_RETURNED,
      returnIDs: [],
    });
    // find games and calculate total price
    const pricePerGame = rentedGames.map(async (rentedGame) => {
      const { gameID, preOrderQuantity, numberOfRentalDays } = rentedGame;
      // find game
      const videoGame: VideoGameDocument =
        await this.videoGameService.getVideoGameById(gameID);

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

      // calculate price by days
      const videoGamePrice = priceByDays(
        videoGame,
        RentalDaysEnum[numberOfRentalDays],
      );

      return (
        videoGamePrice * preOrderQuantity * RentalDaysEnum[numberOfRentalDays]
      );
    });

    rental.estimatedPrice = (await Promise.all(pricePerGame)).reduce(
      (acc, price) => acc + price,
      0,
    );

    const formatDate = (dateString: string) => {
      const date = new Date(dateString);
      const options: Intl.DateTimeFormatOptions = {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      };
      return new Intl.DateTimeFormat('vi-VN', options).format(date);
    };

    const rentalDocument: RentalDocument = await rental.save();

    await this.mailerService.sendMail({
      to: rentalDocument.customer.email,
      subject: 'Rental confirmation',
      template: './rental-confirmation',
      context: {
        rentalCode: rentalDocument.rentalCode,
        customerName: rentalDocument.customer.customerName,
        email: rentalDocument.customer.email,
        phoneNumber: rentalDocument.customer.phoneNumber,
        rentedGames: rentalDocument.rentedGames.map((game) => {
          return {
            name: game.game.productName,
            quantity: game.preOrderQuantity,
            price: game.game.price,
            rentalDays: game.numberOfRentalDays,
            returnDate: formatDate(game.returnDate.toString()),
          };
        }),
        totalPrice: rentalDocument.estimatedPrice,
      },
    });

    return rentalDocument;
  }

  async createRentalFromPreOrder(preOrderID: string): Promise<Rental> {
    const preOrder = await this.preOrderService.getPreOrderById(preOrderID);
    const rental = new this.rentalModel({
      rentalCode: await this.autoCodeService.generateAutoCode('SE'),
      customer: preOrder.customer,
      rentedGames: preOrder.rentedGames,
      estimatedPrice: preOrder.estimatedPrice,
      deposit: 0,
      returnValue: 0,
      returnState: ReturnStateEnum.NOT_RETURNED,
    });
    return await rental.save();
  }

  async getRental(filterRentaldto: FilterRentalDto): Promise<Rental[]> {
    const { phoneNumber, customerName } = filterRentaldto;
    const query = this.rentalModel.find();
    query.setOptions({ lean: true });
    query.populate('customer', 'customerName');
    query.populate('rentedGames.game', 'productName');
    if (customerName) {
      query.where({ customerName: { $regex: customerName, $options: 'i' } });
    }
    if (phoneNumber) {
      query.where({ phoneNumber: { $regex: phoneNumber, $options: 'i' } });
    }
    query.sort({ createdAt: -1 });
    return await query.exec();
  }

  async getRentalById(id: string): Promise<Rental> {
    const result = await this.rentalModel
      .findById(id)
      .populate('customer', 'customerName phoneNumber')
      .populate('rentedGames.game', 'productName price')
      .exec();

    if (!result) {
      throw new NotFoundException(`Rental with id ${id} not found`);
    }
    return result;
  }

  async updateRental(
    id: string,
    updateRentalDto: UpdateRentalDto,
  ): Promise<Rental> {
    const updated = await this.rentalModel
      .findByIdAndUpdate(id, updateRentalDto, { new: true })
      .populate('customer', 'customerName phoneNumber')
      .populate('rentedGames.game', 'productName price')
      .exec();

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

    const rentedGames = result.rentedGames.map((rentedGame) => {
      return {
        gameID: rentedGame.game._id,
        quantity: rentedGame.preOrderQuantity,
      };
    });

    const updatePromises = rentedGames.map(async (rentedGame) => {
      const gameID = rentedGame.gameID.toString();
      const videoGame: VideoGameDocument =
        await this.videoGameService.getVideoGameById(gameID);
      const newQuantity = videoGame.quantity + rentedGame.quantity;
      await this.videoGameService.updateProduct(gameID, {
        quantity: newQuantity,
      });
    });

    await Promise.all(updatePromises);

    await this.rentalModel.deleteOne({ _id: id }).exec();
  }
}

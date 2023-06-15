import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreatePreOrderDto } from './dtos/create-pre-order.dto';
import { UpdatePreOrderDto } from './dtos/update-pre-order.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { PreOrder } from './schemas/pre-order.schema';
import { RentalDaysEnum } from './enums/rental-days.enum';
import { FilterPreOrderDto } from './dtos/filter-pre-order.dto';
import { CustomerService } from 'src/customer/customer.service';
import { VideoGameService } from 'src/video-game/video-game.service';

@Injectable()
export class PreOrderService {
  constructor(
    @InjectModel('PreOrder') private readonly preOrderModel: Model<PreOrder>,
    private readonly customerService: CustomerService,
    private readonly videoGameService: VideoGameService,
  ) {}

  async createPreOrder(
    createPreOrderDto: CreatePreOrderDto,
  ): Promise<PreOrder> {
    const {
      customerID,
      phoneNumber,
      customerName,
      rentedGames,
      numberOfRentalDays,
    } = createPreOrderDto;

    // find customer
    const customer = await this.customerService.getCustomerById(customerID, {
      customerName,
      phoneNumber,
    });

    // create new pre-order
    const preOrder = new this.preOrderModel({
      customer,
      numberOfRentalDays: RentalDaysEnum[numberOfRentalDays],
    });

    // find games and calculate total price
    const totalGamesPrice = rentedGames.map(async (rentedGame) => {
      const { gameID, preOrderQuantity } = rentedGame;
      // find game
      const videoGame = await this.videoGameService.getVideoGameById(gameID);
      // add game and update quantity

      if (videoGame.quantity >= preOrderQuantity && preOrderQuantity > 0) {
        preOrder.rentedGames.push({ game: videoGame, preOrderQuantity });
      } else {
        throw new BadRequestException(
          `Game ${videoGame.productName} is out of stock`,
        );
      }
      return videoGame.price * preOrderQuantity;
    });

    const totalPrice = (await Promise.all(totalGamesPrice)).reduce(
      (acc, price) => acc + price,
      0,
    );

    // calculate estimated price
    switch (preOrder.numberOfRentalDays) {
      case RentalDaysEnum.ONE_DAY:
        preOrder.estimatedPrice = totalPrice;
        break;
      case RentalDaysEnum.THREE_DAYS:
        preOrder.estimatedPrice = totalPrice * 0.85;
        break;
      case RentalDaysEnum.SEVEN_DAYS:
        preOrder.estimatedPrice = totalPrice * 0.85;
        break;
      case RentalDaysEnum.THIRTY_DAYS:
        preOrder.estimatedPrice = totalPrice * 0.83;
        break;
      case RentalDaysEnum.SIXTY_DAYS:
        preOrder.estimatedPrice = totalPrice * 0.8;
        break;
      default:
        preOrder.estimatedPrice = totalPrice;
        break;
    }

    // calculate return date
    const returnDate = new Date(Date.now());
    returnDate.setDate(returnDate.getDate() + preOrder.numberOfRentalDays);
    preOrder.returnDate = returnDate;

    return await preOrder.save();
  }

  async getPreOrder(filterPreOrderDto: FilterPreOrderDto): Promise<PreOrder[]> {
    const { name } = filterPreOrderDto;

    const query = this.preOrderModel.find();
    query.setOptions({ lean: true });
    if (name) {
      query.where({ name: { $regex: name, $options: 'i' } });
    }
    return await query.exec();
  }

  async getPreOrderById(id: string): Promise<PreOrder> {
    return await this.preOrderModel.findById(id).exec();
  }

  // update(id: number, updatePreOrderDto: UpdatePreOrderDto) {
  //   return `This action updates a #${id} preOrder`;
  // }

  async deletePreOrder(id: string): Promise<void> {
    const result = await this.getPreOrderById(id);
    if (!result) {
      throw new NotFoundException(`Customer with id ${id} not found`);
    }
    await this.preOrderModel.deleteOne({ _id: id }).exec();
  }
}

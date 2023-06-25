import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreatePreOrderDto } from './dtos/create-pre-order.dto';
// import { UpdatePreOrderDto } from './dtos/update-pre-order.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { PreOrder } from './schemas/pre-order.schema';
import { RentalDaysEnum } from './enums/rental-days.enum';
import { CustomerService } from 'src/customer/customer.service';
import { VideoGameService } from 'src/video-game/video-game.service';
import { MailerService } from '@nestjs-modules/mailer';
import { Customer } from 'src/customer/schemas/customer.schema';

@Injectable()
export class PreOrderService {
  constructor(
    @InjectModel('PreOrder') private readonly preOrderModel: Model<PreOrder>,
    private readonly customerService: CustomerService,
    private readonly videoGameService: VideoGameService,
    private readonly mailerService: MailerService,
  ) {}

  async createPreOrder(
    createPreOrderDto: CreatePreOrderDto,
  ): Promise<PreOrder> {
    const { customerID, email, phoneNumber, customerName, rentedGames } =
      createPreOrderDto;

    // find customer
    const customer = await this.customerService.getCustomerById(customerID, {
      email,
      customerName,
      phoneNumber,
    });

    // create new pre-order
    const preOrder = new this.preOrderModel({
      customer,
    });

    // find games and calculate total price
    const totalGamesPrice = rentedGames.map(async (rentedGame) => {
      const { gameID, preOrderQuantity, numberOfRentalDays } = rentedGame;
      const videoGame = await this.videoGameService.getVideoGameById(gameID);

      const returnDate = new Date(Date.now());
      returnDate.setDate(
        returnDate.getDate() + RentalDaysEnum[numberOfRentalDays],
      );

      if (videoGame.quantity >= preOrderQuantity && preOrderQuantity > 0) {
        preOrder.rentedGames.push({
          game: videoGame,
          preOrderQuantity,
          numberOfRentalDays: RentalDaysEnum[numberOfRentalDays],
          returnDate,
        });
      } else {
        throw new BadRequestException(
          `Game ${videoGame.productName} is out of stock`,
        );
      }

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

    const totalPrice = (await Promise.all(totalGamesPrice)).reduce(
      (acc, price) => acc + price,
      0,
    );
    preOrder.estimatedPrice = totalPrice;

    const formatDate = (dateString: string) => {
      const date = new Date(dateString);
      const options: Intl.DateTimeFormatOptions = {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      };
      return new Intl.DateTimeFormat('vi-VN', options).format(date);
    };

    // send email
    await this.mailerService.sendMail({
      to: email,
      subject: 'Pre-order confirmation',
      template: './pre-order-confirmation',
      context: {
        customerName,
        email,
        phoneNumber,
        rentedGames: preOrder.rentedGames.map((game) => {
          return {
            name: game.game.productName,
            quantity: game.preOrderQuantity,
            price: game.game.price,
            rentalDays: game.numberOfRentalDays,
            returnDate: formatDate(game.returnDate.toString()),
          };
        }),
        totalPrice: preOrder.estimatedPrice,
      },
    });

    return await preOrder.save();
  }

  async getPreOrders(): Promise<PreOrder[]> {
    const query = this.preOrderModel.find();
    query.setOptions({ lean: true });
    query.populate('customer');
    query.populate('rentedGames.game');
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

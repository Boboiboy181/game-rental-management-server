import { Injectable } from '@nestjs/common';
import { CreatePreOrderDto } from './dtos/create-pre-order.dto';
import { UpdatePreOrderDto } from './dtos/update-pre-order.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { PreOrder } from './schemas/pre-order.schema';
import { VideoGame } from 'src/video-game/schemas/video-game.schema';
import { RentalDaysEnum } from './enums/rental-days.enum';

@Injectable()
export class PreOrderService {
  constructor(
    @InjectModel('PreOrder') private readonly preOrderModel: Model<PreOrder>,
    @InjectModel('VideoGame') private readonly videoGameModel: Model<VideoGame>,
  ) {}

  async createPreOrder(
    createPreOrderDto: CreatePreOrderDto,
  ): Promise<PreOrder> {
    const { customerName, rentedGames, numberOfRentalDays } = createPreOrderDto;

    // create new pre-order
    const preOrder = new this.preOrderModel({
      customerName,
      numberOfRentalDays: RentalDaysEnum[numberOfRentalDays],
    });

    // find games and calculate total price
    let totalGamesPrice = 0;
    for (const rentedGame of rentedGames) {
      const { game, quantity } = rentedGame;

      const videoGame = await this.videoGameModel
        .findOne({
          productName: { $regex: new RegExp(game, 'i') },
        })
        .exec();
      if (!videoGame) {
        throw new Error(`Game ${game} not found`);
      }
      totalGamesPrice += videoGame.price * quantity;
      preOrder.rentedGames.push({ game: videoGame, quantity });
    }

    // calculate return date
    const returnDate = new Date(Date.now());
    returnDate.setDate(returnDate.getDate() + preOrder.numberOfRentalDays);
    preOrder.returnDate = returnDate;

    // calculate estimated price
    if (preOrder.numberOfRentalDays == 3 || preOrder.numberOfRentalDays == 14) {
      preOrder.estimatedPrice = totalGamesPrice * 0.85;
    } else if (preOrder.numberOfRentalDays == 30) {
      preOrder.estimatedPrice = totalGamesPrice * 0.83;
    } else if (preOrder.numberOfRentalDays == 60) {
      preOrder.estimatedPrice = totalGamesPrice * 0.8;
    } else {
      preOrder.estimatedPrice = totalGamesPrice;
    }

    return await preOrder.save();
  }

  findAll() {
    return `This action returns all preOrder`;
  }

  async getPreOrderById(id: string): Promise<PreOrder> {
    return await this.preOrderModel.findById(id).exec();
  }

  update(id: number, updatePreOrderDto: UpdatePreOrderDto) {
    return `This action updates a #${id} preOrder`;
  }

  remove(id: number) {
    return `This action removes a #${id} preOrder`;
  }
}

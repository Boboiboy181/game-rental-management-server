import { Injectable } from '@nestjs/common';
import { CreatePreOrderDto } from './dtos/create-pre-order.dto';
import { UpdatePreOrderDto } from './dtos/update-pre-order.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { PreOrder } from './schemas/pre-order.schema';
import { VideoGame } from 'src/video-game/schemas/video-game.schema';

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
      numberOfRentalDays,
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
    returnDate.setDate(returnDate.getDate() + numberOfRentalDays);
    preOrder.returnDate = returnDate;

    // calculate estimated price
    if (numberOfRentalDays == 3 || numberOfRentalDays == 14) {
      preOrder.estimatedPrice = totalGamesPrice * 0.85;
    } else if (numberOfRentalDays == 30) {
      preOrder.estimatedPrice = totalGamesPrice * 0.83;
    } else if (numberOfRentalDays == 60) {
      preOrder.estimatedPrice = totalGamesPrice * 0.8;
    } else {
      preOrder.estimatedPrice = totalGamesPrice;
    }

    return await preOrder.save();
  }

  findAll() {
    return `This action returns all preOrder`;
  }

  findOne(id: number) {
    return `This action returns a #${id} preOrder`;
  }

  update(id: number, updatePreOrderDto: UpdatePreOrderDto) {
    return `This action updates a #${id} preOrder`;
  }

  remove(id: number) {
    return `This action removes a #${id} preOrder`;
  }
}

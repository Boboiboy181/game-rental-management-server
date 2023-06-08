import { Injectable } from '@nestjs/common';
import { CreateRentalDto } from './dtos/create-rental.dto';
import { UpdateRentalDto } from './dtos/update-rental.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Rental } from './schemas/rental.schema';
import { VideoGame } from '../video-game/schemas/video-game.schema';
import { RentalDaysEnum } from '../pre-order/enums/rental-days.enum';

@Injectable()
export class RentalService {
  constructor(
    @InjectModel('Rental') private readonly rentalModel: Model<Rental>,
    @InjectModel('VideoGame') private readonly videoGameModel: Model<VideoGame>,
  ) {}

  async createRental(createRentalDto: CreateRentalDto): Promise<Rental> {
    const { customerName, rentedGames, numberOfRentalDays, deposit } =
      createRentalDto;

    // create new rental
    const rental = new this.rentalModel({
      customerName,
      numberOfRentalDays: RentalDaysEnum[numberOfRentalDays],
      deposit,
    });

    // find games and calculate total price
    const totalGamesPrice = rentedGames.map(async (rentedGame) => {
      const { game, quantity } = rentedGame;

      const videoGame = await this.videoGameModel
        .findOne({
          productName: { $regex: new RegExp(game, 'i') },
        })
        .exec();
      if (!videoGame) {
        throw new Error(`Game ${game} not found`);
      }

      rental.rentedGames.push({ game: videoGame, quantity });
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
    if (rental.numberOfRentalDays == 3 || rental.numberOfRentalDays == 14) {
      rental.estimatedPrice = totalPrice * 0.85;
    } else if (rental.numberOfRentalDays == 30) {
      rental.estimatedPrice = totalPrice * 0.83;
    } else if (rental.numberOfRentalDays == 60) {
      rental.estimatedPrice = totalPrice * 0.8;
    } else {
      rental.estimatedPrice = totalPrice;
    }
    return await rental.save();
  }

  findAll() {
    return `This action returns all rental`;
  }

  async getRentalById(id: string): Promise<Rental> {
    const result = await this.rentalModel.findById(id).exec();
    if (!result) {
      throw new Error(`Rental with id ${id} not found`);
    }
    return result;
  }

  update(id: number, updateRentalDto: UpdateRentalDto) {
    return `This action updates a #${id} rental`;
  }

  remove(id: number) {
    return `This action removes a #${id} rental`;
  }
}

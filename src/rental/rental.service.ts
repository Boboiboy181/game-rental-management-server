import { Injectable } from '@nestjs/common';
import { CreateRentalDto } from './dtos/create-rental.dto';
import { UpdateRentalDto } from './dtos/update-rental.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Rental } from './schemas/rental.schema';

@Injectable()
export class RentalService {
  constructor(@InjectModel('Rental') private rentalModel: Model<Rental>) {}

  create(createRentalDto: CreateRentalDto) {
    return 'This action adds a new rental';
  }

  findAll() {
    return `This action returns all rental`;
  }

  findOne(id: number) {
    return `This action returns a #${id} rental`;
  }

  update(id: number, updateRentalDto: UpdateRentalDto) {
    return `This action updates a #${id} rental`;
  }

  remove(id: number) {
    return `This action removes a #${id} rental`;
  }
}

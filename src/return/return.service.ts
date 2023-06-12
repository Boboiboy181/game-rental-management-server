import { Injectable } from '@nestjs/common';
import { CreateReturnDto } from './dtos/create-return.dto';
import { UpdateReturnDto } from './dtos/update-return.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Rental } from 'src/rental/schemas/rental.schema';

@Injectable()
export class ReturnService {
  constructor(
    @InjectModel('rental') private readonly rentalModel: Model<Rental>,
  ) {}

  create(createReturnDto: CreateReturnDto) {
    return 'This action adds a new return';
  }

  findAll() {
    return `This action returns all return`;
  }

  findOne(id: number) {
    return `This action returns a #${id} return`;
  }

  update(id: number, updateReturnDto: UpdateReturnDto) {
    return `This action updates a #${id} return`;
  }

  remove(id: number) {
    return `This action removes a #${id} return`;
  }
}

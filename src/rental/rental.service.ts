import { Injectable } from '@nestjs/common';
import { CreateRentalDto } from './dtos/create-rental.dto';
import { UpdateRentalDto } from './dtos/update-rental.dto';

@Injectable()
export class RentalService {
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

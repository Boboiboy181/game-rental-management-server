import { Injectable } from '@nestjs/common';
import { CreatePreOrderDto } from './dtos/create-pre-order.dto';
import { UpdatePreOrderDto } from './dtos/update-pre-order.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { PreOrder } from './schemas/pre-order.schema';

@Injectable()
export class PreOrderService {
  constructor(
    @InjectModel('PreOrder') private readonly preOrderModel: Model<PreOrder>,
  ) {}

  create(createPreOrderDto: CreatePreOrderDto) {
    return 'This action adds a new preOrder';
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

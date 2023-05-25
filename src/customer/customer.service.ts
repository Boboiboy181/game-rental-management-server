import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateCustomerDto } from './dtos/create-customer.dto';
import { UpdateCustomerDto } from './dtos/update-customer.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Customer } from './schemas/customer.schema';
import { FilterCustomerDto } from './dtos/filter-customer.dto';

@Injectable()
export class CustomerService {
  constructor(
    @InjectModel('Customer')
    private readonly customerModel: Model<Customer>,
  ) {}

  create(createCustomerDto: CreateCustomerDto) {
    return 'This action adds a new customer';
  }

  async getCustomers(
    filterCustomerDto: FilterCustomerDto,
  ): Promise<Customer[]> {
    const { name, email, phoneNumber, sort } = filterCustomerDto;

    const query = this.customerModel.find();
    query.setOptions({ lean: true });
    if (name) {
      query.where({ name: { $regex: name, $options: 'i' } });
    }
    if (email) {
      query.where({ email: { $regex: email, $options: 'i' } });
    }
    if (phoneNumber) {
      query.where({ phoneNumber: { $regex: phoneNumber, $options: 'i' } });
    }
    if (sort) {
      query.sort(sort);
    }

    return await query.exec();
  }

  async getCustomerById(id: string): Promise<Customer> {
    const result = await this.customerModel.findById(id).exec();
    if (!result) {
      throw new NotFoundException(`Customer with id ${id} not found`);
    }
    return result;
  }

  update(id: number, updateCustomerDto: UpdateCustomerDto) {
    return `This action updates a #${id} customer`;
  }

  remove(id: number) {
    return `This action removes a #${id} customer`;
  }
}

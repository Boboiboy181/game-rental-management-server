import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateCustomerDto } from './dtos/create-customer.dto';
import { UpdateCustomerDto } from './dtos/update-customer.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Customer } from './schemas/customer.schema';
import { FilterCustomerDto } from './dtos/filter-customer.dto';
import { CreateRentalDto } from '../rental/dtos/create-rental.dto';

@Injectable()
export class CustomerService {
  constructor(
    @InjectModel('Customer')
    private readonly customerModel: Model<Customer>,
  ) {}

  async createCustomer(
    createCustomerDto: CreateCustomerDto,
  ): Promise<Customer> {
    const customer = new this.customerModel({
      ...createCustomerDto,
    });
    customer.point = 0;
    return await customer.save();
  }

  async getCustomers(
    filterCustomerDto: FilterCustomerDto,
  ): Promise<Customer[]> {
    const { name, email, phoneNumber } = filterCustomerDto;

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
    return await query.exec();
  }

  // old code
  // async getCustomerById(id: string): Promise<Customer> {
  //   const result = await this.customerModel.findById(id).exec();
  //   if (!result) {
  //     throw new NotFoundException(`Customer with id ${id} not found`);
  //   }
  //   return result;
  // }

  // new code
  async getCustomerById(
    id: string,
    createCustomerDto?: CreateCustomerDto,
  ): Promise<Customer> {
    try {
      const result = await this.customerModel.findById(id).exec();
      if (!result) {
        throw new NotFoundException(`Customer with id ${id} not found`);
      }
      return result;
    } catch (error) {
      if (error instanceof NotFoundException || error.name === 'CastError') {
        if (createCustomerDto) {
          const { phoneNumber, customerName } = createCustomerDto;
          return await this.createCustomer({
            customerName,
            phoneNumber,
            email: ' ',
            address: ' ',
          });
        } else {
          throw error;
        }
      }
      // Re-throw other errors
      throw error;
    }
  }

  async updateCustomer(
    id: string,
    updateCustomerDto: UpdateCustomerDto,
  ): Promise<Customer> {
    const updated = await this.customerModel.findByIdAndUpdate(
      id,
      updateCustomerDto,
      { new: true },
    );
    if (!updated) {
      throw new NotFoundException('Customer not found');
    }
    return updated;
  }

  async deleteCustomer(id: string): Promise<void> {
    const result = await this.getCustomerById(id);
    if (!result) {
      throw new NotFoundException(`Customer with id ${id} not found`);
    }
    await this.customerModel.deleteOne({ _id: id }).exec();
  }
}

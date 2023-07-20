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
          const { phoneNumber, customerName, email } = createCustomerDto;
          return await this.createCustomer({
            customerName,
            phoneNumber,
            email,
            address: '',
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

  async checkCustomerReferenced(
    id: string,
    modelNames: string[],
  ): Promise<boolean> {
    const checkPromises = modelNames.map(async (modelName) => {
      const model = this.customerModel.db.models[modelName];
      if (!model) {
        throw new Error(`Model with name '${modelName}' not found.`);
      }
      return model.countDocuments({ customer: id }).exec();
    });
    const counts = await Promise.all(checkPromises);

    return counts.some((count) => count > 0);
  }

  async deleteCustomer(id: string): Promise<void> {
    // Check if the customer is referenced in other models
    const isReferenced = await this.checkCustomerReferenced(id, [
      'PreOrder',
      'Rental',
      'Return',
      'Invoice',
    ]);

    if (isReferenced) {
      // Handle the scenario where the customer is referenced in other models
      throw new NotFoundException(
        `Cannot delete customer with id ${id} because it is referenced in other models.`,
      );
    }

    // If the customer is not referenced, proceed with deleting the customer
    const result = await this.getCustomerById(id);
    if (!result) {
      throw new NotFoundException(`Customer with id ${id} not found`);
    }
    await this.customerModel.deleteOne({ _id: id }).exec();
  }
}

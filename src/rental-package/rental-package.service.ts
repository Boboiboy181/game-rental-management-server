import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateRentalPackageDto } from './dtos/create-rental-package.dto';
import { UpdateRentalPackageDto } from './dtos/update-rental-package.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { RentalPackage } from './schemas/rental-package.schema';
import { FilterRentalPackageDto } from './dtos/filter-rental-package.dto';
import { FilterRegisterRentalPackageListDto } from './dtos/filter-register-rental-package.dto';
import { RegisterRentalPackageDto } from './dtos/register-rental-package.dto';
import {
  RentalPackageRegistration,
  RentalPackageRegistrationDocument,
} from './schemas/rental-package-registration.schema';
import { Customer } from 'src/customer/schemas/customer.schema';
import { UpdateRegisterRentalPackageDto } from './dtos/update-register-rental-package.dto';

@Injectable()
export class RentalPackageService {
  constructor(
    @InjectModel('RentalPackage')
    private readonly rentalPackageModel: Model<RentalPackage>,
    @InjectModel('RentalPackageRegistration')
    private readonly rentalPackageRegistrationModel: Model<RentalPackageRegistration>,
    @InjectModel('Customer')
    private readonly customerModel: Model<Customer>,
  ) {}

  async createRentalPackage(
    createRentalPackageDto: CreateRentalPackageDto,
  ): Promise<RentalPackage> {
    const rentalPackage = new this.rentalPackageModel({
      ...createRentalPackageDto,
    });
    return await rentalPackage.save();
  }

  async getRentalPackages(
    filterRentalPackageDto: FilterRentalPackageDto,
  ): Promise<RentalPackage[]> {
    const { packageName, numberOfGames, price, timeOfRental } =
      filterRentalPackageDto;
    const query = this.rentalPackageModel.find();
    query.setOptions({ lean: true });
    if (numberOfGames) {
      query.where({ numberOfGames });
    }
    if (price) {
      query.where({ price });
    }
    if (timeOfRental) {
      query.where({ timeOfRental });
    }
    if (packageName) {
      query.where({
        $or: [{ packageName: { $regex: packageName, $options: 'i' } }],
      });
    }
    return await query.exec();
  }

  async getRentalPackageById(id: string): Promise<RentalPackage> {
    const result = await this.rentalPackageModel.findById(id).exec();
    if (!result) {
      throw new NotFoundException(`Rental Package with id ${id} not found`);
    }
    return result;
  }

  async registerRentalPackage(
    registerRentalPackageDto: RegisterRentalPackageDto,
  ): Promise<RentalPackageRegistration> {
    const { packageSearch, customerSearch } = registerRentalPackageDto;

    // Find the package
    const rentalPackage = await this.rentalPackageModel.findOne({
      packageName: { $regex: new RegExp(packageSearch, 'i') },
    });
    if (!rentalPackage) {
      throw new NotFoundException(
        `Rental Package with name: ${packageSearch} not found`,
      );
    }
    // Find the customer
    const customer = await this.customerModel.findOne({
      phoneNumber: customerSearch,
    });
    if (!customer) {
      throw new NotFoundException(
        `Rental Package with phone number: ${customerSearch} not found`,
      );
    }
    // Register the package
    const rentalPackageRegistration = new this.rentalPackageRegistrationModel({
      rentalPackage,
      customer,
    });
    rentalPackageRegistration.numberOfGameRemaining =
      rentalPackage.numberOfGames;

    return await rentalPackageRegistration.save();
  }

  async getRegistrationByCustomerID(
    customerID: string,
  ): Promise<RentalPackageRegistrationDocument[]> {
    const query = this.rentalPackageRegistrationModel.find();
    query.where('customer').equals(customerID);
    query.sort({ registrationDate: -1 });
    query.limit(1);
    return await query.exec();
  }

  async deleteRegistrationByID(registrationID: string): Promise<void> {
    const result = await this.rentalPackageRegistrationModel
      .findById(registrationID)
      .exec();
    if (!result) {
      throw new NotFoundException(
        `Rental Package Registration with id ${registrationID} not found`,
      );
    }
    await this.rentalPackageRegistrationModel.deleteOne({
      _id: registrationID,
    });
  }

  async updateRegistration(
    register: RentalPackageRegistrationDocument,
    updateRegisterRentalPackage: UpdateRegisterRentalPackageDto,
  ): Promise<RentalPackageRegistration> {
    const { numberOfGameRemaining } = updateRegisterRentalPackage;
    register.numberOfGameRemaining = numberOfGameRemaining;
    return await register.save();
  }

  async getRegisterRentalPackage(
    filterRegisterRentalPackageListDto: FilterRegisterRentalPackageListDto,
  ): Promise<RentalPackageRegistration[]> {
    const { packageName, name, phoneNumber } =
      filterRegisterRentalPackageListDto;

    const query = this.rentalPackageRegistrationModel.find();
    query.setOptions({ lean: true });

    // Sẽ tìm package name có trong CSDL gói
    if (packageName) {
      const rentalPackage = await this.rentalPackageModel.findOne({
        packageName: { $regex: packageName, $options: 'i' },
      });

      if (!rentalPackage) {
        throw new NotFoundException(
          `Rental Package with id ${packageName} not found`,
        );
      }
      // Lấy id
      const rentalPackage_id: string = rentalPackage._id.toHexString();
      query.where('rentalPackage').equals(rentalPackage_id);
    }
    // Sẽ tìm package name có trong CSDL KH
    if (phoneNumber) {
      const customer = await this.customerModel.findOne({
        phoneNumber: { $regex: phoneNumber, $options: 'i' },
      });

      if (!customer) {
        throw new NotFoundException(
          `Rental Package with customer's name: ${phoneNumber} not found`,
        );
      }
      const customer_id: string = customer._id.toHexString();
      query.where('customer').equals(customer_id);
    }
    // Sẽ tìm package name có trong CSDL KH
    if (name) {
      const customer = await this.customerModel.findOne({
        name: { $regex: name, $options: 'i' },
      });

      if (!customer) {
        throw new NotFoundException(
          `Rental Package with customer's name: ${name} not found`,
        );
      }
      const customer_id: string = customer._id.toHexString();
      query.where('customer').equals(customer_id);
    }

    query.sort({ createdAt: -1 });

    const results = await query
      .populate('customer', 'customerName phoneNumber')
      .exec();
    if (results.length === 0) {
      throw new NotFoundException(
        `Rental Package Registeration cannot be found`,
      );
    }
    return results;
  }

  async updateRentalPackage(
    id: string,
    updateRentalPackageDto: UpdateRentalPackageDto,
  ): Promise<RentalPackage> {
    const updatedpackage = await this.rentalPackageModel.findByIdAndUpdate(
      id,
      updateRentalPackageDto,
      { new: true },
    );
    if (!updatedpackage) {
      throw new NotFoundException('Rental Package not found');
    }
    return updatedpackage;
  }

  async deleteRentalPackage(id: string): Promise<void> {
    const result = await this.getRentalPackageById(id);
    if (!result) {
      throw new NotFoundException(`Rental Package with id ${id} not found`);
    }
    await this.rentalPackageModel.deleteOne({ _id: id }).exec();
  }
}

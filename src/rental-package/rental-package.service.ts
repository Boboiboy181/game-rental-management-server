import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateRentalPackageDto } from './dtos/create-rental-package.dto';
import { UpdateRentalPackageDto } from './dtos/update-rental-package.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { RentalPackage } from './schemas/rental-package.schema';
import { FilterRentalPackageDto } from './dtos/filter-rental-package.dto';
import { RegisterRentalPackageDto } from './dtos/register-rental-package.dto';
import { RentalPackageRegistration } from './schemas/rental-package-registration.schema';
import { Customer } from 'src/customer/schemas/customer.schema';

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

    // Find the customer
    const customer = await this.customerModel.findOne({
      phoneNumber: customerSearch,
    });

    // Register the package
    const rentalPackageRegistration = new this.rentalPackageRegistrationModel({
      rentalPackage,
      customer,
    });
    return await rentalPackageRegistration.save();
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
    await this.customerModel.deleteOne({ _id: id }).exec();
  }
}

import { Injectable } from '@nestjs/common';
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

  findOne(id: number) {
    return `This action returns a #${id} rentalPackage`;
  }

  update(id: number, updateRentalPackageDto: UpdateRentalPackageDto) {
    return `This action updates a #${id} rentalPackage`;
  }

  remove(id: number) {
    return `This action removes a #${id} rentalPackage`;
  }
}

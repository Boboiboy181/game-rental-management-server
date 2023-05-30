import { Injectable } from '@nestjs/common';
import { CreateRentalPackageDto } from './dtos/create-rental-package.dto';
import { UpdateRentalPackageDto } from './dtos/update-rental-package.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { RentalPackage } from './schemas/rental-package.schema';
import { FilterRentalPackageDto } from './dtos/filter-rental-package.dto';

@Injectable()
export class RentalPackageService {
  constructor(
    @InjectModel('RentalPackage')
    private readonly rentalPackageModel: Model<RentalPackage>,
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

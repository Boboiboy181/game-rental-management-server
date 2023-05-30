import { Injectable } from '@nestjs/common';
import { CreateRentalPackageDto } from './dtos/create-rental-package.dto';
import { UpdateRentalPackageDto } from './dtos/update-rental-package.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { RentalPackage } from './schemas/rental-package.schema';

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

  findAll() {
    return `This action returns all rentalPackage`;
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

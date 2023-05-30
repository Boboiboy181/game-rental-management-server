import { Injectable } from '@nestjs/common';
import { CreateRentalPackageDto } from './dtos/create-rental-package.dto';
import { UpdateRentalPackageDto } from './dtos/update-rental-package.dto';

@Injectable()
export class RentalPackageService {
  create(createRentalPackageDto: CreateRentalPackageDto) {
    return 'This action adds a new rentalPackage';
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

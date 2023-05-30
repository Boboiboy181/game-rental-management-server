import { Module } from '@nestjs/common';
import { RentalPackageService } from './rental-package.service';
import { RentalPackageController } from './rental-package.controller';

@Module({
  controllers: [RentalPackageController],
  providers: [RentalPackageService],
})
export class RentalPackageModule {}

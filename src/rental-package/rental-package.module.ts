import { Module } from '@nestjs/common';
import { RentalPackageService } from './rental-package.service';
import { RentalPackageController } from './rental-package.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { RentalPackageSchema } from './schemas/rental-package.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'RentalPackage', schema: RentalPackageSchema },
    ]),
  ],
  controllers: [RentalPackageController],
  providers: [RentalPackageService],
})
export class RentalPackageModule {}

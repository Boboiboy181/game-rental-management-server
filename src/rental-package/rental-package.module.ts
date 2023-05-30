import { Module } from '@nestjs/common';
import { RentalPackageService } from './rental-package.service';
import { RentalPackageController } from './rental-package.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { RentalPackageSchema } from './schemas/rental-package.schema';
import { RentalPackageRegistrationSchema } from './schemas/rental-package-registration.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'RentalPackage', schema: RentalPackageSchema },
      {
        name: 'RentalPackageRegistration',
        schema: RentalPackageRegistrationSchema,
      },
    ]),
  ],
  controllers: [RentalPackageController],
  providers: [RentalPackageService],
})
export class RentalPackageModule {}

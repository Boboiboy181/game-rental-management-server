import { Module } from '@nestjs/common';
import { RentalPackageService } from './rental-package.service';
import { RentalPackageController } from './rental-package.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { RentalPackageSchema } from './schemas/rental-package.schema';
import { RentalPackageRegistrationSchema } from './schemas/rental-package-registration.schema';
import { CustomerModule } from 'src/customer/customer.module';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'RentalPackage', schema: RentalPackageSchema },
      {
        name: 'RentalPackageRegistration',
        schema: RentalPackageRegistrationSchema,
      },
    ]),
    CustomerModule,
    AuthModule,
  ],
  controllers: [RentalPackageController],
  providers: [RentalPackageService],
  exports: [RentalPackageService],
})
export class RentalPackageModule {}

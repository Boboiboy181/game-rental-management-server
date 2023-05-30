import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Schema as MongooseSchema, HydratedDocument } from 'mongoose';
import { RentalPackage } from './rental-package.schema';
import { Customer } from 'src/customer/schemas/customer.schema';

export type RentalPackageRegistrationDocument =
  HydratedDocument<RentalPackageRegistration>;

@Schema()
export class RentalPackageRegistration {
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'RentalPackage' })
  rentalPackage: RentalPackage;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Customer' })
  customer: Customer;

  @Prop({ default: Date.now })
  registrationDate: Date;

  @Prop({
    default: () => {
      const endDate = new Date();
      endDate.setDate(endDate.getDate() + 30);
      return endDate;
    },
  })
  registrationEndDate: Date;
}

export const RentalPackageRegistrationSchema = SchemaFactory.createForClass(
  RentalPackageRegistration,
);

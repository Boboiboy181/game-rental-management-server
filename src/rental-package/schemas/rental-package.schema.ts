import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Schema as MongooseSchema, Types } from 'mongoose';

export type RentalPackageDocument = HydratedDocument<RentalPackage>;

@Schema({ timestamps: true })
export class RentalPackage {
  // name of rental package
  @Prop({ unique: true })
  packageName: string;

  // number of games that can be rented
  @Prop()
  numberOfGames: number;

  // price of rental package
  @Prop()
  price: number;

  // time of rental in days
  @Prop()
  timeOfRental: number;

  // customer registration this rental package is associated with
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Customer' })
  customerRegistration: Types.ObjectId[];
}

export const RentalPackageSchema = SchemaFactory.createForClass(RentalPackage);

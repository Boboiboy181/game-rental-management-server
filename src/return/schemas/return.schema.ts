import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Schema as MongooseSchema } from 'mongoose';
import { Customer } from 'src/customer/schemas/customer.schema';
import { VideoGame } from 'src/video-game/schemas/video-game.schema';
import { PaymentStateEnum } from '../enum/payment-state.enum';
import { RentalDaysEnum } from 'src/pre-order/enums/rental-days.enum';
import { Rental } from 'src/rental/schemas/rental.schema';

export type ReturnDocument = HydratedDocument<Return>;

@Schema({ timestamps: true })
export class Return {
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Customer' })
  customer: Customer;

  @Prop()
  numberOfRentalDays: RentalDaysEnum;

  @Prop()
  returnDate: Date;

  @Prop({ default: 0 })
  daysPastDue: number;

  @Prop([
    {
      game: { type: MongooseSchema.Types.ObjectId, ref: 'VideoGame' },
      quantity: Number,
    },
  ])
  rentedGames: [{ game: VideoGame; quantity: number }];

  @Prop()
  deposit: number;

  @Prop()
  estimatedPrice: number;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Rental' })
  rental: Rental;

  @Prop()
  paymentState: PaymentStateEnum;
}

export const ReturnSchema = SchemaFactory.createForClass(Return);

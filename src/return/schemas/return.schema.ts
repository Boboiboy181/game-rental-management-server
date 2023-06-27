import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Schema as MongooseSchema } from 'mongoose';
import { Customer } from 'src/customer/schemas/customer.schema';
import { VideoGame } from 'src/video-game/schemas/video-game.schema';
import { Rental } from 'src/rental/schemas/rental.schema';
import { PaymentStateEnum } from '../enum/payment-state.enum';

export type ReturnDocument = HydratedDocument<Return>;

@Schema({ timestamps: true })
export class Return {
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Customer' })
  customer: Customer;

  @Prop([
    {
      game: { type: MongooseSchema.Types.ObjectId, ref: 'VideoGame' },
      preOrderQuantity: Number,
      numberOfRentalDays: Number,
      returnDate: Date,
      daysPastDue: Number,
      fine: Number,
    },
  ])
  rentedGames: [
    {
      game: VideoGame;
      preOrderQuantity: number;
      numberOfRentalDays: number;
      returnDate: Date;
      daysPastDue: number;
      fine: number;
    },
  ];

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

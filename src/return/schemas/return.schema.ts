import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Schema as MongooseSchema } from 'mongoose';
import { CustomerDocument } from 'src/customer/schemas/customer.schema';
import {
  VideoGame,
  VideoGameDocument,
} from 'src/video-game/schemas/video-game.schema';
import { PaymentStateEnum } from '../enum/payment-state.enum';

export type ReturnDocument = HydratedDocument<Return>;

@Schema({ timestamps: true })
export class Return {
  @Prop({ unique: true })
  returnCode: string;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Customer' })
  customer: CustomerDocument;

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
      game: VideoGameDocument;
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

  @Prop()
  rentalCode: string;

  @Prop()
  paymentState: PaymentStateEnum;
}

export const ReturnSchema = SchemaFactory.createForClass(Return);

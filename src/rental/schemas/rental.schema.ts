import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Schema as MongooseSchema } from 'mongoose';
import { RentalDaysEnum } from '../../pre-order/enums/rental-days.enum';
import { VideoGame } from '../../video-game/schemas/video-game.schema';
import { Customer } from '../../customer/schemas/customer.schema';

export type RentalDocument = HydratedDocument<Rental>;

@Schema({ timestamps: true })
export class Rental {
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Customer' })
  customer: Customer;

  @Prop()
  numberOfRentalDays: RentalDaysEnum;

  @Prop()
  returnDate: Date;

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

  @Prop()
  returnState: boolean;
}

export const RentalSchema = SchemaFactory.createForClass(Rental);

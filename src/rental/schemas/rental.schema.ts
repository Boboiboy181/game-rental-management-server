import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type RentalDocument = HydratedDocument<Rental>;

@Schema({ timestamps: true })
export class Rental {
  @Prop()
  customerName: string;

  @Prop()
  numberOfRentalDays: number;

  @Prop()
  returnDate: Date;

  @Prop([
    {
      game: { type: String },
      quantity: Number,
    },
  ])
  rentedGames: [{ game: string; quantity: number }];

  @Prop()
  deposit: number;

  @Prop()
  estimatedPrice: number;
}

export const RentalSchema = SchemaFactory.createForClass(Rental);

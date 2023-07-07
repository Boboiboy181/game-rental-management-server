import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Schema as MongooseSchema } from 'mongoose';
import { VideoGame } from '../../video-game/schemas/video-game.schema';
import { Customer } from '../../customer/schemas/customer.schema';
import { ReturnStateEnum } from '../enums/return-state.enum';
import { generateAutoCode } from 'src/utils/generate-auto-code';

export type RentalDocument = HydratedDocument<Rental>;

@Schema({ timestamps: true })
export class Rental {
  @Prop({ unique: true, default: generateAutoCode('SE') })
  rentalCode: string;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Customer' })
  customer: Customer;

  @Prop([
    {
      game: { type: MongooseSchema.Types.ObjectId, ref: 'VideoGame' },
      preOrderQuantity: Number,
      numberOfRentalDays: Number,
      returnDate: Date,
    },
  ])
  rentedGames: [
    {
      game: VideoGame;
      preOrderQuantity: number;
      numberOfRentalDays: number;
      returnDate: Date;
    },
  ];

  @Prop()
  deposit: number;

  @Prop()
  estimatedPrice: number;

  @Prop()
  returnValue: number;

  @Prop()
  returnState: ReturnStateEnum;
}

export const RentalSchema = SchemaFactory.createForClass(Rental);

import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Schema as MongooseSchema } from 'mongoose';
import {
  VideoGame,
  VideoGameDocument,
} from 'src/video-game/schemas/video-game.schema';
import { Customer } from 'src/customer/schemas/customer.schema';

export type PreOrderDocument = HydratedDocument<PreOrder>;

@Schema({ timestamps: true })
export class PreOrder {
  @Prop({ unique: true })
  preOrderCode: string;

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
      game: VideoGameDocument;
      preOrderQuantity: number;
      numberOfRentalDays: number;
      returnDate: Date;
    },
  ];

  @Prop()
  estimatedPrice: number;
}

export const PreOrderSchema = SchemaFactory.createForClass(PreOrder);

// auto delete document after 6 hours
PreOrderSchema.index({ createdAt: 1 }, { expireAfterSeconds: 21600 });

import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { VideoGame } from 'src/video-game/schemas/video-game.schema';

export type PreOrderDocument = HydratedDocument<PreOrder>;

@Schema({ timestamps: true })
export class PreOrder {
  @Prop()
  customerName: string;

  @Prop()
  numberOfRentalDays: number;

  @Prop()
  returnDate: Date;

  @Prop()
  rentedGames: [{ game: VideoGame; quantity: number }];

  @Prop()
  estimatedPrice: number;
}

export const PreOrderSchema = SchemaFactory.createForClass(PreOrder);

// auto delete document after 6 hours
PreOrderSchema.index({ createAt: 1 }, { expireAfterSeconds: 6 * 6 * 60 });

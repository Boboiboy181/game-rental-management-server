import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Schema as MongooseSchema } from 'mongoose';
import { Customer } from 'src/customer/schemas/customer.schema';
import { VideoGame } from 'src/video-game/schemas/video-game.schema';
import { Voucher } from './voucher.schema';

export type InvoiceDocument = HydratedDocument<Invoice>;

@Schema({ timestamps: true })
export class Invoice {
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Customer' })
  customer: Customer;

  @Prop([
    {
      game: { type: MongooseSchema.Types.ObjectId, ref: 'VideoGame' },
      quantity: Number,
    },
  ])
  rentedGames: [{ game: VideoGame; quantity: number }];

  @Prop([{ type: MongooseSchema.Types.ObjectId, ref: 'Voucher' }])
  voucher: Voucher[];

  @Prop()
  fine: number;

  @Prop()
  finalPrice: number;
}

export const InvoiceSchema = SchemaFactory.createForClass(Invoice);

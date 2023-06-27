import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Schema as MongooseSchema } from 'mongoose';
import { Customer } from 'src/customer/schemas/customer.schema';
import { VideoGame } from 'src/video-game/schemas/video-game.schema';
import { Voucher } from './voucher.schema';
import { Return } from 'src/return/schemas/return.schema';

export type InvoiceDocument = HydratedDocument<Invoice>;

@Schema({ timestamps: true })
export class Invoice {
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

  @Prop([{ type: MongooseSchema.Types.ObjectId, ref: 'Voucher' }])
  voucher: Voucher[];

  @Prop()
  fine: number;

  @Prop()
  finalPrice: number;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Return' })
  return: Return;
}

export const InvoiceSchema = SchemaFactory.createForClass(Invoice);

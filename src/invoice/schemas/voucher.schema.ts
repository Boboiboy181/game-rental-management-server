import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type VoucherDocument = HydratedDocument<Voucher>;

@Schema()
export class Voucher {
  @Prop()
  voucherName: string;

  @Prop()
  voucherCode: string;

  @Prop()
  voucherValue: number;

  @Prop()
  pointRequired: number;
}

export const VoucherSchema = SchemaFactory.createForClass(Voucher);

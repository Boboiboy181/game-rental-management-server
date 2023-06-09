import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type CustomerDocument = HydratedDocument<Customer>;

@Schema({ timestamps: true })
export class Customer {
  @Prop()
  customerName: string;

  @Prop({ unique: true })
  email: string;

  @Prop({ unique: true })
  phoneNumber: string;

  @Prop()
  address: string;

  @Prop()
  point: number;
}

export const CustomerSchema = SchemaFactory.createForClass(Customer);

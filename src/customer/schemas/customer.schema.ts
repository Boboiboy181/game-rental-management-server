import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Type } from 'class-transformer';
import { HydratedDocument } from 'mongoose';

export type CustomerDocument = HydratedDocument<Customer>;

@Schema({ timestamps: true })
export class Customer {
  @Prop()
  name: string;

  @Prop()
  phoneNumber: string;

  @Prop()
  address: string;

  @Prop()
  point: number;
}

export const CustomerSchema = SchemaFactory.createForClass(Customer);

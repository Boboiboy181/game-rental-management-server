import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type AutoCodeDocument = HydratedDocument<AutoCode>;

@Schema()
export class AutoCode {
  @Prop({ default: 'PSE' })
  prefix: string;

  @Prop({ default: 0 })
  counter: number;
}

export const AutoCodeSchema = SchemaFactory.createForClass(AutoCode);

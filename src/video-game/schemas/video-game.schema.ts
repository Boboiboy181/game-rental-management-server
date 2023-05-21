import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type VideoGameDocument = HydratedDocument<VideoGame>;

@Schema({ timestamps: true })
export class VideoGame {
  @Prop()
  productName: string;

  @Prop()
  quantity: number;

  @Prop()
  price: number;

  @Prop()
  manufacture: string;

  @Prop()
  genre: string;

  @Prop()
  releaseDate: string;

  @Prop()
  language: string;

  @Prop()
  system: string;

  @Prop()
  description: string;

  @Prop()
  imageUrl: string[];
}

export const VideoGameSchema = SchemaFactory.createForClass(VideoGame);

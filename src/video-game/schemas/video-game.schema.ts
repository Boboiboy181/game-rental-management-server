import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { VideoGameGenreEnum } from '../enums/video-game-genre.enum';
import { VideoGameSystemEnum } from '../enums/video-game-system.enum';

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
  genre: VideoGameGenreEnum;

  @Prop()
  releaseDate: string;

  @Prop()
  language: string;

  @Prop()
  system: VideoGameSystemEnum;

  @Prop()
  description: string;

  @Prop()
  imageUrl: string[];
}

export const VideoGameSchema = SchemaFactory.createForClass(VideoGame);

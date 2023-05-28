import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { VideoGameGenreEnum } from '../enums/video-game-genre.enum';
import { VideoGameSystemEnum } from '../enums/video-game-system.enum';
import { ApiProperty } from '@nestjs/swagger';

export type VideoGameDocument = HydratedDocument<VideoGame>;

@Schema({ timestamps: true })
export class VideoGame {
  @ApiProperty({ example: 'FIFA 22' })
  @Prop()
  productName: string;

  @ApiProperty({ example: 59.99 })
  @Prop()
  price: number;

  @ApiProperty({ example: 10 })
  @Prop()
  quantity: number;

  @ApiProperty({ example: 'EA' })
  @Prop()
  manufacture: string;

  @ApiProperty({ example: VideoGameGenreEnum.Action })
  @Prop()
  genre: VideoGameGenreEnum;

  @ApiProperty({ example: '2021-10-01' })
  @Prop()
  releaseDate: string;

  @ApiProperty({ example: 'English' })
  @Prop()
  language: string;

  @ApiProperty({ example: VideoGameSystemEnum.PlayStation4 })
  @Prop()
  system: VideoGameSystemEnum;

  @ApiProperty({
    example:
      'FIFA 22 is a football simulation video game published by Electronic Arts as part of the FIFA series.',
  })
  @Prop()
  description: string;

  @ApiProperty({
    example: ['https://i.imgur.com/1.jpg', 'https://i.imgur.com/2.jpg'],
  })
  @Prop()
  imageUrl: string[];

  @ApiProperty({ example: 'fifa-22' })
  @Prop()
  slug: string;
}

export const VideoGameSchema = SchemaFactory.createForClass(VideoGame);

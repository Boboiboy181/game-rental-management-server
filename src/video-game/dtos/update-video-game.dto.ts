import { PartialType } from '@nestjs/mapped-types';
import { CreateVideoGameDto } from './create-video-game.dto';
import { IsOptional, IsEnum } from 'class-validator';
import { VideoGameGenreEnum } from '../enums/video-game-genre.enum';
import { VideoGameSystemEnum } from '../enums/video-game-system.enum';
export class UpdateVideoGameDto extends PartialType(CreateVideoGameDto) {
  @IsOptional()
  @IsEnum(VideoGameSystemEnum)
  system?: VideoGameSystemEnum;

  @IsOptional()
  @IsEnum(VideoGameGenreEnum)
  genre: VideoGameGenreEnum;
}

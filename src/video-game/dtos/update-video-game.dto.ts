import { PartialType } from '@nestjs/mapped-types';
import { CreateVideoGameDto } from './create-video-game.dto';
import { IsEnum, IsOptional } from 'class-validator';
import { VideoGameGenreEnum } from '../enums/video-game-genre.enum';
import { VideoGameSystemEnum } from '../enums/video-game-system.enum';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateVideoGameDto extends PartialType(CreateVideoGameDto) {
  @ApiProperty({ enum: VideoGameSystemEnum })
  @IsOptional()
  @IsEnum(VideoGameSystemEnum)
  system?: VideoGameSystemEnum;


  @ApiProperty({ enum: VideoGameGenreEnum })
  @IsOptional()
  @IsEnum(VideoGameGenreEnum)
  genre: VideoGameGenreEnum;
}

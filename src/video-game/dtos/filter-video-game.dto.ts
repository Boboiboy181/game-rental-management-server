import { IsEnum, IsOptional, IsString } from 'class-validator';
import { VideoGameGenreEnum } from '../enums/video-game-genre.enum';
import { VideoGameSystemEnum } from '../enums/video-game-system.enum';

export class FilterVideoGameDto {
  @IsOptional()
  @IsEnum(VideoGameGenreEnum)
  genre?: VideoGameGenreEnum;

  @IsOptional()
  @IsEnum(VideoGameSystemEnum)
  system?: VideoGameSystemEnum;

  @IsOptional()
  @IsString()
  manufacture?: string;

  @IsOptional()
  @IsString()
  search?: string;
}

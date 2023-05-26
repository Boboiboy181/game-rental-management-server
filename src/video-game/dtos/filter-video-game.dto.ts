import { IsEnum, IsOptional, IsString } from 'class-validator';
import { VideoGameGenreEnum } from '../enums/video-game-genre.enum';
import { VideoGameSystemEnum } from '../enums/video-game-system.enum';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class FilterVideoGameDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsEnum(VideoGameGenreEnum)
  genre?: VideoGameGenreEnum;

  @ApiPropertyOptional()
  @IsOptional()
  @IsEnum(VideoGameSystemEnum)
  system?: VideoGameSystemEnum;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  manufacture?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  search?: string;
}

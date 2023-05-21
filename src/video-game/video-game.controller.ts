import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { VideoGameService } from './video-game.service';
import { CreateVideoGameDto } from './dtos/create-video-game.dto';
import { UpdateVideoGameDto } from './dtos/update-video-game.dto';
import { VideoGame } from './schemas/video-game.schema';
import { FilterVideoGameDto } from './dtos/filter-video-game.dto';
import { DeleteVideoGameDto } from './dtos/delete-video-game.dto';

@Controller('video-game')
export class VideoGameController {
  constructor(private readonly videoGameService: VideoGameService) { }

  @Post()
  create(@Body() createVideoGameDto: CreateVideoGameDto): Promise<VideoGame> {
    return this.videoGameService.createVideoGame(createVideoGameDto);
  }

  @Get()
  getVideoGames(
    @Query() filterVideoGameDto: FilterVideoGameDto,
  ): Promise<VideoGame[]> {
    return this.videoGameService.getVideoGames(filterVideoGameDto);
  }

  @Get(':id')
  getVideoGameById(@Param('id') id: string): Promise<VideoGame> {
    return this.videoGameService.getVideoGameById(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateVideoGameDto: UpdateVideoGameDto,
  ) {
    return this.videoGameService.update(+id, updateVideoGameDto);
  }

  @Delete(':id')
  deleteVideoGame(@Param('id') gameId: string): Promise<void> {
    const deleteVideoGameDto = new DeleteVideoGameDto();
    deleteVideoGameDto.gameId = gameId;
    return this.videoGameService.deleteVideoGame(deleteVideoGameDto);
  }
}

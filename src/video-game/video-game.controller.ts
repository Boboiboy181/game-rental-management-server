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
import {
  ApiCreatedResponse,
  ApiOkResponse,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

@ApiTags('video-game')
@Controller('video-game')
export class VideoGameController {
  constructor(private readonly videoGameService: VideoGameService) {}

  @Post()
  @ApiCreatedResponse({ type: VideoGame })
  create(@Body() createVideoGameDto: CreateVideoGameDto): Promise<VideoGame> {
    return this.videoGameService.createVideoGame(createVideoGameDto);
  }

  @Get()
  @ApiOkResponse({ type: [VideoGame] })
  getVideoGames(
    @Query() filterVideoGameDto: FilterVideoGameDto,
  ): Promise<VideoGame[]> {
    return this.videoGameService.getVideoGames(filterVideoGameDto);
  }

  @Get(':id')
  @ApiOkResponse({ type: VideoGame })
  getVideoGameById(@Param('id') id: string): Promise<VideoGame> {
    return this.videoGameService.getVideoGameById(id);
  }

  @Patch(':id')
  @ApiOkResponse({ type: VideoGame })
  update(
    @Param('id') id: string,
    @Body() updateVideoGameDto: UpdateVideoGameDto,
  ): Promise<VideoGame> {
    return this.videoGameService.updateProduct(id, updateVideoGameDto);
  }

  @Delete(':id')
  @ApiResponse({ status: 204, description: 'Delete success' })
  async deleteVideoGame(@Param('id') id: string): Promise<void> {
    await this.videoGameService.deleteVideoGame(id);
  }
}
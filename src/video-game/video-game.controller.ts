import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { VideoGameService } from './video-game.service';
import { CreateVideoGameDto } from './dto/create-video-game.dto';
import { UpdateVideoGameDto } from './dto/update-video-game.dto';

@Controller('video-game')
export class VideoGameController {
  constructor(private readonly videoGameService: VideoGameService) {}

  @Post()
  create(@Body() createVideoGameDto: CreateVideoGameDto) {
    return this.videoGameService.create(createVideoGameDto);
  }

  @Get()
  findAll() {
    return this.videoGameService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.videoGameService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateVideoGameDto: UpdateVideoGameDto) {
    return this.videoGameService.update(+id, updateVideoGameDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.videoGameService.remove(+id);
  }
}

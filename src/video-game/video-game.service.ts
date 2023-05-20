import { Injectable } from '@nestjs/common';
import { CreateVideoGameDto } from './dto/create-video-game.dto';
import { UpdateVideoGameDto } from './dto/update-video-game.dto';

@Injectable()
export class VideoGameService {
  create(createVideoGameDto: CreateVideoGameDto) {
    return 'This action adds a new videoGame';
  }

  findAll() {
    return `This action returns all videoGame`;
  }

  findOne(id: number) {
    return `This action returns a #${id} videoGame`;
  }

  update(id: number, updateVideoGameDto: UpdateVideoGameDto) {
    return `This action updates a #${id} videoGame`;
  }

  remove(id: number) {
    return `This action removes a #${id} videoGame`;
  }
}

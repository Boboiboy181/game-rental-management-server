import { Injectable } from '@nestjs/common';
import { CreateVideoGameDto } from './dto/create-video-game.dto';
import { UpdateVideoGameDto } from './dto/update-video-game.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { VideoGame } from './schemas/video-game.schema';

@Injectable()
export class VideoGameService {
  constructor(
    @InjectModel('VideoGame') private readonly videoGameModel: Model<VideoGame>,
  ) {}

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

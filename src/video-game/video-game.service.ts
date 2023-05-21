import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateVideoGameDto } from './dtos/create-video-game.dto';
import { UpdateVideoGameDto } from './dtos/update-video-game.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { VideoGame } from './schemas/video-game.schema';
import { VideoGameGenreEnum } from './enums/video-game-genre.enum';
import { VideoGameSystemEnum } from './enums/video-game-system.enum';
import { FilterVideoGameDto } from './dtos/filter-video-game.dto';
import { DeleteVideoGameDto } from './dtos/delete-video-game.dto';
// import { DeleteVideoGameDto } from './dtos/delete-video-game.dto';

@Injectable()
export class VideoGameService {
  constructor(
    @InjectModel('VideoGame') private readonly videoGameModel: Model<VideoGame>,
  ) { }

  async createVideoGame(
    createVideoGameDto: CreateVideoGameDto,
  ): Promise<VideoGame> {
    const videoGame = new this.videoGameModel({
      ...createVideoGameDto,
      system: VideoGameSystemEnum.Default,
      genre: VideoGameGenreEnum.Default,
    });
    return await videoGame.save();
  }

  async getVideoGames(
    filterVideoGameDto: FilterVideoGameDto,
  ): Promise<VideoGame[]> {
    const { genre, system, manufacture, search } = filterVideoGameDto;
    const query = this.videoGameModel.find();
    query.setOptions({ lean: true });
    if (genre) {
      query.where({ genre });
    }
    if (system) {
      query.where({ system });
    }
    if (manufacture) {
      query.where({ manufacture });
    }
    if (search) {
      query.where({
        $or: [{ productName: { $regex: search, $options: 'i' } }],
      });
    }
    return await query.exec();
  }

  async deleteVideoGame(deleteVideoGameDto: DeleteVideoGameDto): Promise<void> {
    const { gameId } = deleteVideoGameDto;
    await this.videoGameModel.deleteOne({ _id: gameId }).exec();
  }


  async getVideoGameById(id: string): Promise<VideoGame> {
    const result = await this.videoGameModel.findById(id).exec();
    if (!result) {
      throw new NotFoundException(`Video game with id ${id} not found`);
    }
    return result;
  }

  update(id: number, updateVideoGameDto: UpdateVideoGameDto) {
    return `This action updates a #${id} videoGame`;
  }

  remove(id: number) {
    this.getVideoGameById
    return `This action removes a #${id} videoGame`;
  }
}

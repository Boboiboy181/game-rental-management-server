import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateVideoGameDto } from './dtos/create-video-game.dto';
import { UpdateVideoGameDto } from './dtos/update-video-game.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { VideoGame } from './schemas/video-game.schema';
import { VideoGameGenreEnum } from './enums/video-game-genre.enum';
import { VideoGameSystemEnum } from './enums/video-game-system.enum';
import { FilterVideoGameDto } from './dtos/filter-video-game.dto';
import slugify from 'slugify';

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
      slug: slugify(createVideoGameDto.productName, { lower: true }),
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

  async deleteVideoGame(id: string): Promise<void> {
    const result = await this.getVideoGameById(id);
    if (!result) {
      throw new NotFoundException(`Video game with id ${id} not found`);
    }
    await this.videoGameModel.deleteOne({ _id: id }).exec();
  }

  async updateProduct(id: string, updateVideoGameDto: UpdateVideoGameDto): Promise<VideoGame> {
    const updated = await this.videoGameModel.findByIdAndUpdate(
      id,
      updateVideoGameDto,
      { new: true },
    );
    if (!updated) {
      throw new NotFoundException('Product not found');
    }
    return updated;
  }

  async getVideoGameById(id: string): Promise<VideoGame> {
    const result = await this.videoGameModel.findById(id).exec();
    if (!result) {
      throw new NotFoundException(`Video game with id ${id} not found`);
    }
    return result;
  }
}

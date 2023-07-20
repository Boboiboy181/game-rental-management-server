import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateVideoGameDto } from './dtos/create-video-game.dto';
import { UpdateVideoGameDto } from './dtos/update-video-game.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { VideoGame, VideoGameDocument } from './schemas/video-game.schema';
import { VideoGameGenreEnum } from './enums/video-game-genre.enum';
import { VideoGameSystemEnum } from './enums/video-game-system.enum';
import { FilterVideoGameDto } from './dtos/filter-video-game.dto';
import slugify from 'slugify';

@Injectable()
export class VideoGameService {
  constructor(
    @InjectModel('VideoGame') private readonly videoGameModel: Model<VideoGame>,
  ) {}

  async createVideoGame(
    createVideoGameDto: CreateVideoGameDto,
    imageUrl: string,
  ): Promise<VideoGame> {
    const { system, genre } = createVideoGameDto;
    const videoGame = new this.videoGameModel({
      ...createVideoGameDto,
      system: VideoGameSystemEnum[system],
      genre: VideoGameGenreEnum[genre],
      slug: slugify(createVideoGameDto.productName, { lower: true }),
    });
    videoGame.imageUrl.push(imageUrl);
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

  async checkVideoGameReferenced(
    id: string,
    modelNames: string[],
  ): Promise<boolean> {
    const checkPromises = modelNames.map(async (modelName) => {
      const model = this.videoGameModel.db.models[modelName];
      if (!model) {
        throw new Error(`Model with name '${modelName}' not found.`);
      }
      // Use $elemMatch to match the elements in the rentedGames array
      return model
        .countDocuments({ rentedGames: { $elemMatch: { game: id } } })
        .exec();
    });

    const counts = await Promise.all(checkPromises);
    return counts.some((count) => count > 0);
  }

  async deleteVideoGame(id: string): Promise<void> {
    // Check if the customer is referenced in other models
    const isReferenced = await this.checkVideoGameReferenced(id, [
      'PreOrder',
      'Rental',
      'Return',
      'Invoice',
    ]);

    if (isReferenced) {
      // Handle the scenario where the customer is referenced in other models
      throw new NotFoundException(
        `Cannot delete video game with id ${id} because it is referenced in other models.`,
      );
    }

    // If the customer is not referenced, proceed with deleting the customer
    const result = await this.getVideoGameById(id);
    if (!result) {
      throw new NotFoundException(`Customer with id ${id} not found`);
    }
    await this.videoGameModel.deleteOne({ _id: id }).exec();
  }

  async updateProduct(
    id: string,
    updateVideoGameDto: UpdateVideoGameDto,
  ): Promise<VideoGame> {
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

  async getVideoGameById(id: string): Promise<VideoGameDocument> {
    const result = await this.videoGameModel.findById(id).exec();
    if (!result) {
      throw new NotFoundException(`Video game with id ${id} not found`);
    }
    return result;
  }
}

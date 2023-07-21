import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { VideoGameService } from './video-game.service';
import { CreateVideoGameDto } from './dtos/create-video-game.dto';
import { UpdateVideoGameDto } from './dtos/update-video-game.dto';
import { VideoGame } from './schemas/video-game.schema';
import { FilterVideoGameDto } from './dtos/filter-video-game.dto';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';

@ApiBearerAuth()
@ApiTags('video-game')
@Controller('video-game')
export class VideoGameController {
  constructor(
    private readonly videoGameService: VideoGameService,
    private readonly cloudinaryService: CloudinaryService,
  ) {}

  @Post()
  @UseInterceptors(FileInterceptor('file'))
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        productName: { type: 'string' },
        price: { type: 'number' },
        quantity: { type: 'number' },
        manufacture: { type: 'string' },
        genre: { type: 'string' },
        releaseDate: { type: 'string' },
        language: { type: 'string' },
        system: { type: 'string' },
        description: { type: 'string' },
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @ApiCreatedResponse({ type: VideoGame })
  async create(
    @Body() createVideoGameDto: CreateVideoGameDto,
    @UploadedFile() file: Express.Multer.File,
  ): Promise<VideoGame> {
    // extract the image url from the cloudinary service
    const result = await this.cloudinaryService.uploadFile(file);
    const { secure_url } = result;

    // assign the image url to the createVideoGameDto
    return this.videoGameService.createVideoGame(
      createVideoGameDto,
      secure_url,
    );
  }

  // example of how to upload a file to cloudinary using the cloudinary service
  // @Post('/upload')
  // @UseInterceptors(FileInterceptor('file'))
  // async ploadImage(@UploadedFile() file: Express.Multer.File) {
  //   const result = await this.cloudinaryService.uploadFile(file);
  //   const { secure_url } = result;
  //   console.log(secure_url);
  // }

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

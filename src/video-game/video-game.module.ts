import { Module } from '@nestjs/common';
import { VideoGameService } from './video-game.service';
import { VideoGameController } from './video-game.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { VideoGameSchema } from './schemas/video-game.schema';
import { CloudinaryModule } from 'src/cloudinary/cloudinary.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'VideoGame', schema: VideoGameSchema }]),
    CloudinaryModule,
  ],
  controllers: [VideoGameController],
  providers: [VideoGameService],
})
export class VideoGameModule {}

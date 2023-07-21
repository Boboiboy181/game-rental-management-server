import { Module } from '@nestjs/common';
import { VideoGameService } from './video-game.service';
import { VideoGameController } from './video-game.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { VideoGameSchema } from './schemas/video-game.schema';
import { CloudinaryModule } from 'src/cloudinary/cloudinary.module';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'VideoGame', schema: VideoGameSchema }]),
    CloudinaryModule,
    AuthModule,
  ],
  controllers: [VideoGameController],
  providers: [VideoGameService],
  exports: [VideoGameService, MongooseModule],
})
export class VideoGameModule {}

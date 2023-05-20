import { Module } from '@nestjs/common';
import { VideoGameService } from './video-game.service';
import { VideoGameController } from './video-game.controller';

@Module({
  controllers: [VideoGameController],
  providers: [VideoGameService]
})
export class VideoGameModule {}

import { Module } from '@nestjs/common';
import { ReturnService } from './return.service';
import { ReturnController } from './return.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { ReturnSchema } from './schemas/return.schema';
import { RentalModule } from 'src/rental/rental.module';
import { RentalService } from 'src/rental/rental.service';
import { VideoGameModule } from 'src/video-game/video-game.module';
import { VideoGameService } from 'src/video-game/video-game.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Return', schema: ReturnSchema }]),
    VideoGameModule,
    RentalModule,
  ],
  controllers: [ReturnController],
  providers: [ReturnService, VideoGameService],
})
export class ReturnModule {}

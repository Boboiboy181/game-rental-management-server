import { Module } from '@nestjs/common';
import { RentalService } from './rental.service';
import { RentalController } from './rental.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { RentalSchema } from './schemas/rental.schema';
import { VideoGameModule } from '../video-game/video-game.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Rental', schema: RentalSchema }]),
    VideoGameModule,
  ],
  controllers: [RentalController],
  providers: [RentalService],
})
export class RentalModule {}

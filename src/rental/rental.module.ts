import { Module } from '@nestjs/common';
import { RentalService } from './rental.service';
import { RentalController } from './rental.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { RentalSchema } from './schemas/rental.schema';
import { VideoGameModule } from '../video-game/video-game.module';
import { CustomerModule } from '../customer/customer.module';
import { VideoGameService } from '../video-game/video-game.service';
import { CustomerService } from '../customer/customer.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Rental', schema: RentalSchema }]),
    VideoGameModule,
    CustomerModule,
  ],
  controllers: [RentalController],
  providers: [RentalService, VideoGameService, CustomerService],
  exports: [RentalService],
})
export class RentalModule {}

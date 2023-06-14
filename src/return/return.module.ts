import { Module } from '@nestjs/common';
import { ReturnService } from './return.service';
import { ReturnController } from './return.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { ReturnSchema } from './schemas/return.schema';
import { RentalModule } from 'src/rental/rental.module';
import { VideoGameModule } from 'src/video-game/video-game.module';
import { CustomerModule } from 'src/customer/customer.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Return', schema: ReturnSchema }]),
    VideoGameModule,
    RentalModule,
    CustomerModule,
  ],
  controllers: [ReturnController],
  providers: [ReturnService],
})
export class ReturnModule {}

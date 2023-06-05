import { Module } from '@nestjs/common';
import { PreOrderService } from './pre-order.service';
import { PreOrderController } from './pre-order.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { PreOrderSchema } from './schemas/pre-order.schema';
import { VideoGameModule } from 'src/video-game/video-game.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'PreOrder', schema: PreOrderSchema }]),
    VideoGameModule,
  ],
  controllers: [PreOrderController],
  providers: [PreOrderService],
})
export class PreOrderModule {}

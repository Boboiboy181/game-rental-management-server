import { Module } from '@nestjs/common';
import { PreOrderService } from './pre-order.service';
import { PreOrderController } from './pre-order.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { PreOrderSchema } from './schemas/pre-order.schema';
import { VideoGameModule } from 'src/video-game/video-game.module';
import { CustomerModule } from 'src/customer/customer.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'PreOrder', schema: PreOrderSchema }]),
    VideoGameModule,
    CustomerModule,
  ],
  controllers: [PreOrderController],
  providers: [PreOrderService],
})
export class PreOrderModule {}

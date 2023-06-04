import { Module } from '@nestjs/common';
import { PreOrderService } from './pre-order.service';
import { PreOrderController } from './pre-order.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { PreOrderSchema } from './schemas/pre-order.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'PreOrder', schema: PreOrderSchema }]),
  ],
  controllers: [PreOrderController],
  providers: [PreOrderService],
})
export class PreOrderModule {}

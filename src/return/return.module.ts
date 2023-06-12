import { Module } from '@nestjs/common';
import { ReturnService } from './return.service';
import { ReturnController } from './return.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { ReturnSchema } from './schemas/return.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Return', schema: ReturnSchema }]),
  ],
  controllers: [ReturnController],
  providers: [ReturnService],
})
export class ReturnModule {}

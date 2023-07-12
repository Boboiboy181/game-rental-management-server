import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AutoCodeSchema } from './schemas/auto-code.schema';
import { AutoCodeService } from './auto-code.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'AutoCode', schema: AutoCodeSchema }]),
  ],
  providers: [AutoCodeService],
  exports: [AutoCodeService],
})
export class AutoCodeModule {}

import { Module } from '@nestjs/common';
import { RentalService } from './rental.service';
import { RentalController } from './rental.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { RentalSchema } from './schemas/rental.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Rental', schema: RentalSchema }]),
  ],
  controllers: [RentalController],
  providers: [RentalService],
})
export class RentalModule {}

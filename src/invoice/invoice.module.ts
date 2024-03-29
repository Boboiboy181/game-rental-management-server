import { Module } from '@nestjs/common';
import { InvoiceService } from './invoice.service';
import { InvoiceController } from './invoice.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { InvoiceSchema } from './schemas/invoice.schema';
import { VideoGameModule } from 'src/video-game/video-game.module';
import { CustomerModule } from 'src/customer/customer.module';
import { ReturnModule } from 'src/return/return.module';
import { VoucherSchema } from './schemas/voucher.schema';
import { RentalPackageModule } from '../rental-package/rental-package.module';
import { AutoCodeModule } from '../auto-code/auto-code.module';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Invoice', schema: InvoiceSchema }]),
    MongooseModule.forFeature([
      {
        name: 'Voucher',
        schema: VoucherSchema,
      },
    ]),
    VideoGameModule,
    CustomerModule,
    ReturnModule,
    RentalPackageModule,
    AutoCodeModule,
    AuthModule,
  ],
  controllers: [InvoiceController],
  providers: [InvoiceService],
})
export class InvoiceModule {}

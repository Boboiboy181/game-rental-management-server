import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { configValidationSchema } from './config.schema';
import { VideoGameModule } from './video-game/video-game.module';
import { CloudinaryModule } from './cloudinary/cloudinary.module';
import { CustomerModule } from './customer/customer.module';
import { PreOrderModule } from './pre-order/pre-order.module';
import { RentalPackageModule } from './rental-package/rental-package.module';
import { RentalModule } from './rental/rental.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
      validationSchema: configValidationSchema,
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configSerVice: ConfigService) => ({
        uri: configSerVice.get<string>('MONGO_URI'),
      }),
    }),
    AuthModule,
    VideoGameModule,
    CloudinaryModule,
    CustomerModule,
    PreOrderModule,
    RentalPackageModule,
    RentalModule,
  ],
})
export class AppModule {}

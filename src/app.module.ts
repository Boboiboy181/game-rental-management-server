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
import { ReturnModule } from './return/return.module';
import { MailerModule } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { join } from 'path';
import { InvoiceModule } from './invoice/invoice.module';

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
    MailerModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configSerVice: ConfigService) => ({
        transport: {
          host: configSerVice.get<string>('SMTP_HOST'),
          secure: false,
          auth: {
            user: configSerVice.get<string>('SMTP_USERNAME'),
            pass: configSerVice.get<string>('SMTP_PASSWORD'),
          },
        },
        defaults: {
          from: `"No Reply" <${configSerVice.get('SMTP_MAIL_FROM')}>`,
        },
        template: {
          dir: join(__dirname, 'src/templates/emails'),
          adapter: new HandlebarsAdapter(),
          options: {
            strict: true,
          },
        },
      }),
      inject: [ConfigService],
    }),
    AuthModule,
    VideoGameModule,
    CloudinaryModule,
    CustomerModule,
    PreOrderModule,
    RentalPackageModule,
    RentalModule,
    ReturnModule,
    InvoiceModule,
  ],
})
export class AppModule {}

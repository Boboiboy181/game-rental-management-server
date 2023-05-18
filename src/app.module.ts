import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { UserSchema } from './auth/schema/users.schemas';
import { AuthController } from './auth/auth.controller';
import { AuthService } from './auth/auth.service';

@Module({
  imports: [AuthModule,
    MongooseModule.forRoot('mongodb://127.0.0.1:27017/test', {
      dbName: 'auth'
    }),
  ],
})
export class AppModule { }

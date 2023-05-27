import { Module } from '@nestjs/common';
import { CloudinaryService } from './cloudinary.service';
import { Cloudinary } from './cloudinary/cloudinary.provider';

@Module({
  providers: [CloudinaryService, Cloudinary],
})
export class CloudinaryModule {}

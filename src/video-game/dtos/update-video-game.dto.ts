import { PartialType } from '@nestjs/mapped-types';
import { CreateVideoGameDto } from './create-video-game.dto';

export class UpdateVideoGameDto extends PartialType(CreateVideoGameDto) {}

import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class FilterPreOrderDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  name?: string;
}

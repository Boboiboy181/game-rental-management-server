import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateReturnDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  rentalId: string;

  @ApiProperty()
  @IsNotEmpty()
  rentedGames: [{ gameId: string; quantity: number }];
}

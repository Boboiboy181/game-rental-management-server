import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsNumberString,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';
import { RentalDaysEnum } from 'src/pre-order/enums/rental-days.enum';

export class CreateReturnDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  rentalId: string;

  @ApiProperty()
  @IsNotEmpty()
  rentedGames: [{ gameId: string; quantity: number }];
}

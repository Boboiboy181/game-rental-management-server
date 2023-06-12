import { PartialType } from '@nestjs/swagger';
import { CreateRentalDto } from './create-rental.dto';
import { IsEnum, IsOptional } from 'class-validator';
import { ReturnStateEnum } from '../enums/return-state.enum';

export class UpdateRentalDto extends PartialType(CreateRentalDto) {
  @IsOptional()
  @IsEnum(ReturnStateEnum)
  returnState: ReturnStateEnum;
}

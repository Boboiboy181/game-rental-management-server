import { PartialType } from '@nestjs/swagger';
import { CreateRentalDto } from './create-rental.dto';
import { IsArray, IsEnum, IsNumber, IsOptional } from 'class-validator';
import { ReturnStateEnum } from '../enums/return-state.enum';

export class UpdateRentalDto extends PartialType(CreateRentalDto) {
  @IsOptional()
  @IsEnum(ReturnStateEnum)
  returnState?: ReturnStateEnum;

  @IsOptional()
  @IsNumber()
  returnValue?: number;

  @IsOptional()
  @IsArray()
  returnIDs?: string[];
}

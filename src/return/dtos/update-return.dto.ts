import { PartialType } from '@nestjs/swagger';
import { CreateReturnDto } from './create-return.dto';
import { PaymentStateEnum } from '../enum/payment-state.enum';
import { Prop } from '@nestjs/mongoose';
import { IsEnum, IsOptional } from 'class-validator';

export class UpdateReturnDto extends PartialType(CreateReturnDto) {
  @Prop()
  @IsEnum(PaymentStateEnum)
  @IsOptional()
  paymentState: PaymentStateEnum;
}

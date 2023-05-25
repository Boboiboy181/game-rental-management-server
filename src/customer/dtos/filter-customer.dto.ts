import { IsEmail, IsOptional, IsPhoneNumber, IsString } from 'class-validator';

export class FilterCustomerDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsPhoneNumber('VN')
  phoneNumber?: string;

  @IsOptional()
  @IsString()
  sort?: string;
}

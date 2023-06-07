import { PartialType } from '@nestjs/swagger';
import { CreateRentalPackageDto } from './create-rental-package.dto';

export class UpdateRentalPackageDto extends PartialType(
  CreateRentalPackageDto,
) {}

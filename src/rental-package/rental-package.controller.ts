import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { RentalPackageService } from './rental-package.service';
import { CreateRentalPackageDto } from './dtos/create-rental-package.dto';
import { UpdateRentalPackageDto } from './dtos/update-rental-package.dto';

@Controller('rental-package')
export class RentalPackageController {
  constructor(private readonly rentalPackageService: RentalPackageService) {}

  @Post()
  createRentalPackage(@Body() createRentalPackageDto: CreateRentalPackageDto) {
    return this.rentalPackageService.createRentalPackage(
      createRentalPackageDto,
    );
  }

  @Get()
  findAll() {
    return this.rentalPackageService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.rentalPackageService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateRentalPackageDto: UpdateRentalPackageDto,
  ) {
    return this.rentalPackageService.update(+id, updateRentalPackageDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.rentalPackageService.remove(+id);
  }
}

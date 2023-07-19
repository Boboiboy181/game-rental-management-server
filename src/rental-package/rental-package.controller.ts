import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { RentalPackageService } from './rental-package.service';
import { CreateRentalPackageDto } from './dtos/create-rental-package.dto';
import { UpdateRentalPackageDto } from './dtos/update-rental-package.dto';
import { FilterRentalPackageDto } from './dtos/filter-rental-package.dto';
import { RegisterRentalPackageDto } from './dtos/register-rental-package.dto';
import { RentalPackage } from './schemas/rental-package.schema';
import {
  RentalPackageRegistration,
  RentalPackageRegistrationDocument,
} from './schemas/rental-package-registration.schema';
import {
  ApiCreatedResponse,
  ApiOkResponse,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { FilterRegisterRentalPackageListDto } from './dtos/filter-register-rental-package.dto';

@ApiTags('rental-package')
@Controller('rental-package')
export class RentalPackageController {
  constructor(private readonly rentalPackageService: RentalPackageService) {}

  @Post()
  @ApiCreatedResponse({ type: RentalPackage })
  createRentalPackage(@Body() createRentalPackageDto: CreateRentalPackageDto) {
    return this.rentalPackageService.createRentalPackage(
      createRentalPackageDto,
    );
  }

  @Get('registration-list/:id')
  getRegistrationByCustomerID(
    @Param('id') id: string,
  ): Promise<RentalPackageRegistrationDocument[]> {
    return this.rentalPackageService.getRegistrationByCustomerID(id);
  }

  @Get('/registration-list')
  @ApiOkResponse({ type: [RentalPackageRegistration] })
  getRegisterRentalPackage(
    @Query()
    filterRegisterRentalPackageListDto: FilterRegisterRentalPackageListDto,
  ) {
    return this.rentalPackageService.getRegisterRentalPackage(
      filterRegisterRentalPackageListDto,
    );
  }

  @Get()
  @ApiOkResponse({ type: [RentalPackage] })
  getRentalPackages(@Query() filterRentalPackageDto: FilterRentalPackageDto) {
    return this.rentalPackageService.getRentalPackages(filterRentalPackageDto);
  }

  @Get(':id')
  @ApiOkResponse({ type: RentalPackage })
  getRentalPackageById(@Param('id') id: string): Promise<RentalPackage> {
    return this.rentalPackageService.getRentalPackageById(id);
  }

  @Post('/register')
  @ApiCreatedResponse({ type: RentalPackageRegistration })
  registerRentalPackage(
    @Body() registerRentalPackageDto: RegisterRentalPackageDto,
  ) {
    return this.rentalPackageService.registerRentalPackage(
      registerRentalPackageDto,
    );
  }

  @Patch(':id')
  @ApiOkResponse({ type: RentalPackage })
  updateRentalPackage(
    @Param('id') id: string,
    @Body() updateRentalPackageDto: UpdateRentalPackageDto,
  ): Promise<RentalPackage> {
    return this.rentalPackageService.updateRentalPackage(
      id,
      updateRentalPackageDto,
    );
  }

  @Delete(':id')
  @ApiResponse({ status: 204, description: 'Delete success' })
  async deleteRentalPackage(@Param('id') id: string): Promise<void> {
    await this.rentalPackageService.deleteRentalPackage(id);
  }
}

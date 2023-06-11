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
import { RentalService } from './rental.service';
import { CreateRentalDto } from './dtos/create-rental.dto';
import { UpdateRentalDto } from './dtos/update-rental.dto';
import { Rental } from './schemas/rental.schema';
import {
  ApiCreatedResponse,
  ApiOkResponse,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { FilterRentalDto } from './dtos/filter-rental.dto';


@ApiTags('rental')
@Controller('rental')
export class RentalController {
  constructor(private readonly rentalService: RentalService) {}

  @Post()
  @ApiCreatedResponse({ type: Rental })
  createRental(@Body() createRentalDto: CreateRentalDto) {
    return this.rentalService.createRental(createRentalDto);
  }

  @Get()
  @ApiOkResponse({ type: [Rental] })
  getRental(
    @Query() filterRentalDto: FilterRentalDto,
  ): Promise<Rental[]> {
    return this.rentalService.getRental(filterRentalDto);
  }

  @Get(':id')
  @ApiOkResponse({ type: Rental })
  getRentalById(@Param('id') id: string) {
    return this.rentalService.getRentalById(id);
  }

  @Patch(':id')
  @ApiOkResponse({ type: Rental })
  update(@Param('id') id: string, @Body() updateRentalDto: UpdateRentalDto) {
    return this.rentalService.updateRental(id, updateRentalDto);
  }

  @Delete(':id')
  @ApiResponse({ status: 204, description: 'Delete success' })
  async deleteCustomer(@Param('id') id: string): Promise<void> {
    await this.rentalService.deleteRental(id);
  }
}

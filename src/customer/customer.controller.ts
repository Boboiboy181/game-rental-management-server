import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { CustomerService } from './customer.service';
import { CreateCustomerDto } from './dtos/create-customer.dto';
import { UpdateCustomerDto } from './dtos/update-customer.dto';
import { Customer } from './schemas/customer.schema';
import { FilterCustomerDto } from './dtos/filter-customer.dto';

@Controller('customer')
export class CustomerController {
  constructor(private readonly customerService: CustomerService) {}

  @Post()
  create(@Body() createCustomerDto: CreateCustomerDto) {
    return this.customerService.create(createCustomerDto);
  }

  @Get()
  getCustomers(
    @Body() filterCustomerDto: FilterCustomerDto,
  ): Promise<Customer[]> {
    return this.customerService.getCustomers(filterCustomerDto);
  }

  @Get(':id')
  getCustomerById(@Param('id') id: string): Promise<Customer> {
    return this.customerService.getCustomerById(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateCustomerDto: UpdateCustomerDto,
  ) {
    return this.customerService.update(+id, updateCustomerDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.customerService.remove(+id);
  }
}

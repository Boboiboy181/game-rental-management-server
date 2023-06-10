import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { CustomerService } from './customer.service';
import { CreateCustomerDto } from './dtos/create-customer.dto';
import { UpdateCustomerDto } from './dtos/update-customer.dto';
import { Customer } from './schemas/customer.schema';
import { FilterCustomerDto } from './dtos/filter-customer.dto';
import {
  ApiCreatedResponse,
  ApiOkResponse,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

@ApiTags('customer')
@Controller('customer')
export class CustomerController {
  constructor(private readonly customerService: CustomerService) {}

  @Post()
  @ApiCreatedResponse({ type: Customer })
  create(@Body() createCustomerDto: CreateCustomerDto): Promise<Customer> {
    return this.customerService.createCustomer(createCustomerDto);
  }

  @Get()
  @ApiOkResponse({ type: [Customer] })
  getCustomers(
    @Body() filterCustomerDto: FilterCustomerDto,
  ): Promise<Customer[]> {
    return this.customerService.getCustomers(filterCustomerDto);
  }

  @Get(':id')
  @ApiOkResponse({ type: Customer })
  getCustomerById(@Param('id') id: string): Promise<Customer> {
    return this.customerService.getCustomerById(id);
  }

  @Patch(':id')
  @ApiOkResponse({ type: Customer })
  update(
    @Param('id') id: string,
    @Body() updateCustomerDto: UpdateCustomerDto,
  ): Promise<Customer> {
    return this.customerService.updateCustomer(id, updateCustomerDto);
  }

  @Delete(':id')
  @ApiResponse({ status: 204, description: 'Delete success' })
  async deleteCustomer(@Param('id') id: string): Promise<void> {
    await this.customerService.deleteCustomer(id);
  }
}

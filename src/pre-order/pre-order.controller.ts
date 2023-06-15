import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { PreOrderService } from './pre-order.service';
import { CreatePreOrderDto } from './dtos/create-pre-order.dto';
import { UpdatePreOrderDto } from './dtos/update-pre-order.dto';
import { ApiTags, ApiResponse, ApiOkResponse, ApiBody } from '@nestjs/swagger';
import { PreOrder } from './schemas/pre-order.schema';
import { FilterPreOrderDto } from './dtos/filter-pre-order.dto';
import { string } from 'joi';
import { RentalDaysEnum } from './enums/rental-days.enum';

@ApiTags('pre-order')
@Controller('pre-order')
export class PreOrderController {
  constructor(private readonly preOrderService: PreOrderService) {}

  @Post()
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        customerID: { type: 'string' },
        phoneNumber: { type: 'number' },
        customerName: { type: 'string' },
        numberOfRentalDays: { enum: Object.values(RentalDaysEnum) },
        rentedGames: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              gameID: { type: 'string' },
              preOrderQuantity: { type: 'number' },
            },
          },
        },
      },
    },
  })
  createPreOrder(@Body() createPreOrderDto: CreatePreOrderDto) {
    return this.preOrderService.createPreOrder(createPreOrderDto);
  }

  @Get()
  @ApiOkResponse({ type: [PreOrder] })
  getCustomers(
    @Body() filterPreOrderDto: FilterPreOrderDto,
  ): Promise<PreOrder[]> {
    return this.preOrderService.getPreOrder(filterPreOrderDto);
  }

  @Get(':id')
  getPreOrderById(@Param('id') id: string) {
    return this.preOrderService.getPreOrderById(id);
  }

  // @Patch(':id')
  // update(
  //   @Param('id') id: string,
  //   @Body() updatePreOrderDto: UpdatePreOrderDto,
  // ) {
  //   return this.preOrderService.update(+id, updatePreOrderDto);
  // }

  @Delete(':id')
  @ApiResponse({ status: 204, description: 'Delete success' })
  async deleteCustomer(@Param('id') id: string): Promise<void> {
    await this.preOrderService.deletePreOrder(id);
  }
}

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
import { ApiTags, ApiResponse, ApiOkResponse } from '@nestjs/swagger';
import { PreOrder } from './schemas/pre-order.schema';
import { FilterPreOrderDto } from './dtos/filter-pre-order.dto';

@ApiTags('pre-order')
@Controller('pre-order')
export class PreOrderController {
  constructor(private readonly preOrderService: PreOrderService) {}

  @Post()
  createPreOrder(@Body() createPreOrderDto: CreatePreOrderDto) {
    return this.preOrderService.createPreOrder(createPreOrderDto);
  }

  @Get()
  @ApiOkResponse({ type: [PreOrder] })
  getCustomers(): Promise<PreOrder[]> {
    return this.preOrderService.getPreOrder();
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

import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { PreOrderService } from './pre-order.service';
import { CreatePreOrderDto } from './dtos/create-pre-order.dto';
import {
  ApiTags,
  ApiResponse,
  ApiOkResponse,
  ApiBody,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { PreOrder } from './schemas/pre-order.schema';
import { RentalDaysEnum } from './enums/rental-days.enum';
import { AuthGuard } from '@nestjs/passport';
@ApiBearerAuth()
@ApiTags('pre-order')
@Controller('pre-order')
@UseGuards(AuthGuard())
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
  getPreOrders(): Promise<PreOrder[]> {
    return this.preOrderService.getPreOrders();
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

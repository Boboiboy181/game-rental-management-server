import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query
} from '@nestjs/common';
import { ReturnService } from './return.service';
import { CreateReturnDto } from './dtos/create-return.dto';
import { UpdateReturnDto } from './dtos/update-return.dto';
import { FilterReturnDto } from './dtos/filter-return.dto';
import { Return } from './schemas/return.schema';
import { ApiCreatedResponse, ApiOkResponse, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('return')
@Controller('return')
export class ReturnController {
  constructor(private readonly returnService: ReturnService) {}

  @Post()
  @ApiCreatedResponse({ type: Return })
  createReturnTicket(@Body() createReturnDto: CreateReturnDto) {
    return this.returnService.createReturnTicket(createReturnDto);
  }

  @Get()
  @ApiOkResponse({ type: [Return] })
  getReturnTicket(@Query() filterReturnDto: FilterReturnDto) {
    return this.returnService.getReturnTicket(filterReturnDto);
  }

  @Get(':id')
  @ApiOkResponse({ type: Return })
  getReturnTicketById(@Param('id') id: string) {
    return this.returnService.getReturnTicketById(id);
  }

  @Patch(':id')
  @ApiOkResponse({ type: Return })
  update(@Param('id') id: string, @Body() updateReturnDto: UpdateReturnDto) {
    return this.returnService.updateReturnTicket(id, updateReturnDto);
  }

  @Delete(':id')
  @ApiResponse({ status: 204, description: 'Delete success' })
  async deleteReturnTicket(@Param('id') id: string): Promise<void> {
    await this.returnService.deleteReturnTicket(id);
  }
}

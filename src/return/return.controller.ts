import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { ReturnService } from './return.service';
import { CreateReturnDto } from './dtos/create-return.dto';
import { UpdateReturnDto } from './dtos/update-return.dto';

@Controller('return')
export class ReturnController {
  constructor(private readonly returnService: ReturnService) {}

  @Post()
  createReturnTicket(@Body() createReturnDto: CreateReturnDto) {
    return this.returnService.createReturnTicket(createReturnDto);
  }

  @Get()
  findAll() {
    return this.returnService.findAll();
  }

  @Get(':id')
  getReturnTicketById(@Param('id') id: string) {
    return this.returnService.getReturnTicketById(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateReturnDto: UpdateReturnDto) {
    return this.returnService.updateReturnTicket(id, updateReturnDto);
  }

  @Delete(':id')
  async deleteReturnTicket(@Param('id') id: string): Promise<void> {
    await this.returnService.deleteReturnTicket(id);
  }
}

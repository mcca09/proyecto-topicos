import { Controller, Get, Post, Body, Param, ParseUUIDPipe } from '@nestjs/common';
import { StallsService } from './stalls.service';
import { CreateStallDto } from './create-stall.dto';

@Controller('stalls')
export class StallsController {
  constructor(private readonly stallsService: StallsService) {}

  @Post()
  create(@Body() createStallDto: CreateStallDto) {
    return this.stallsService.create(createStallDto);
  }

  @Get()
  findAll() {
    return this.stallsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.stallsService.findOne(id);
  }
}

import { Body, Controller, Delete, Get, Param, Post, Put, Query } from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { ItemsService } from './items.service';
import { CreateItemDto } from './create-item.dto';

@Controller('api/items')
export class ItemsController {
  constructor(private readonly _itemsService: ItemsService) {}

  @Get()
  @ApiOperation({ summary: 'Get all items' })
  @ApiResponse({ status: 200, description: 'List of items.' })
  @Get()
  async findAll(@Query('limit') limit: number = 10, @Query('offset') offset: number = 0) {
    return this._itemsService.findAll(limit, offset);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a item by ID' })
  @ApiResponse({ status: 200, description: 'City found.' })
  @ApiResponse({ status: 404, description: 'City not found.' })
  @Get(':id')
  async findOne(@Param('id') id: number) {
    return this._itemsService.findOne(id);
  }

  @Post()
  @ApiOperation({ summary: 'Create a new item' })
  @ApiResponse({ status: 201, description: 'City created.' })
  @Post()
  async create(@Body() createCityDto: CreateItemDto) {
    return this._itemsService.create(createCityDto);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update a item by ID' })
  @ApiResponse({ status: 200, description: 'City updated.' })
  @Put(':id')
  async update(@Param('id') id: number, @Body() updateCityDto: CreateItemDto) {
    return this._itemsService.update(id, updateCityDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a item by ID' })
  @ApiResponse({ status: 204, description: 'City deleted.' })
  @Delete(':id')
  async remove(@Param('id') id: number) {
    return this._itemsService.remove(id);
  }

  @Post('/multiple')
  async createMultiple(@Body() createItemDto: CreateItemDto) {
    return this._itemsService.createMultiple(createItemDto); // Create user with data from the request
  }

  @Post('/multiple/2')
  async createMultiple2(@Body() createItemDto: CreateItemDto) {
    return this._itemsService.createMultiple2(createItemDto); // Create user with data from the request
  }

  @Post('search')
  @ApiOperation({ summary: 'Search for items by query' })
  @ApiResponse({ status: 200, description: 'List of matching items.' })
  // Search for items by a query string
  @Post('search')
  async search(@Body('query') query: string) {
    return this._itemsService.search(query); // Search items
  }
}
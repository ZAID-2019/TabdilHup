import { Body, Controller, Delete, Get, Param, Post, Put, Query, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { CreateCityDto } from './create-city.dto';
import { CitiesService } from './cities.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('api/cities')
export class CitiesController {
  constructor(private readonly _citiesService: CitiesService) {}
  @Get()
  @ApiOperation({ summary: 'Get all cities' })
  @ApiResponse({ status: 200, description: 'List of cities.' })
  @Get()
  async findAll(@Query('limit') limit: number = 5000, @Query('offset') offset: number = 0) {
    return this._citiesService.findAll(limit, offset);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a city by ID' })
  @ApiResponse({ status: 200, description: 'City found.' })
  @ApiResponse({ status: 404, description: 'City not found.' })
  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this._citiesService.findOne(id);
  }

  @Post()
  @ApiOperation({ summary: 'Create a new city' })
  @ApiResponse({ status: 201, description: 'City created.' })
  @Post()
  async create(@Body() createCityDto: CreateCityDto) {
    return this._citiesService.create(createCityDto);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update a city by ID' })
  @ApiResponse({ status: 200, description: 'City updated.' })
  @Put(':id')
  async update(@Param('id') id: string, @Body() updateCityDto: CreateCityDto) {
    return this._citiesService.update(id, updateCityDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a city by ID' })
  @ApiResponse({ status: 204, description: 'City deleted.' })
  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this._citiesService.remove(id);
  }
}

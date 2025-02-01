import { Body, Controller, Delete, Get, Param, Post, Put, Query } from '@nestjs/common'; // UseGuards
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { CountriesService } from './countries.service';
import { CreateCountryDto } from './create-country.dto';
// import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

// @UseGuards(JwtAuthGuard)
@Controller('api/countries')
export class CountriesController {
  constructor(private readonly _countriesService: CountriesService) {}
  @Get()
  @ApiOperation({ summary: 'Get all countries' })
  @ApiResponse({ status: 200, description: 'List of countries.' })
  @Get()
  async findAll(@Query('limit') limit: number = 5000, @Query('offset') offset: number = 0) {
    return this._countriesService.findAll(limit, offset);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a country by ID' })
  @ApiResponse({ status: 200, description: 'Country found.' })
  @ApiResponse({ status: 404, description: 'Country not found.' })
  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this._countriesService.findOne(id);
  }

  @Post()
  @ApiOperation({ summary: 'Create a new country' })
  @ApiResponse({ status: 201, description: 'Country created.' })
  @Post()
  async create(@Body() createCountryDto: CreateCountryDto) {
    return this._countriesService.create(createCountryDto);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update a country by ID' })
  @ApiResponse({ status: 200, description: 'Country updated.' })
  @Put(':id')
  async update(@Param('id') id: string, @Body() updateCountryDto: CreateCountryDto) {
    return this._countriesService.update(id, updateCountryDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a country by ID' })
  @ApiResponse({ status: 204, description: 'Country deleted.' })
  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this._countriesService.remove(id);
  }
}

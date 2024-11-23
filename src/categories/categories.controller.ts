import { Body, Controller, Delete, Get, Param, Post, Put, Query } from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { CreateCategoryDto } from './create-category.dto';

@Controller('api/categories')
export class CategoriesController {
  constructor(private readonly _categoriesService: CategoriesService) {}

  @Get()
  @ApiOperation({ summary: 'Get all categories' })
  @ApiResponse({ status: 200, description: 'List of categories.' })
  async findAll(@Query('limit') limit: number = 1000, @Query('offset') offset: number = 0) {
    return this._categoriesService.findAll(limit, offset);
  }

  @Get('/sub')
  @ApiOperation({ summary: 'Get all sub categories' })
  @ApiResponse({ status: 200, description: 'List of sub categories.' })
  async findAllSub(@Query('limit') limit: number = 1000, @Query('offset') offset: number = 0) {
    return this._categoriesService.findAllSub(limit, offset);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a category by ID' })
  @ApiResponse({ status: 200, description: 'Category found.' })
  @ApiResponse({ status: 404, description: 'Category not found.' })
  @Get(':id')
  async findOne(@Param('id') id: number) {
    return this._categoriesService.findOne(id);
  }

  @ApiOperation({ summary: 'Create a new category' })
  @ApiResponse({ status: 201, description: 'Category created.' })
  @Post()
  async create(@Body() createCategoryDto: CreateCategoryDto) {
    return this._categoriesService.create(createCategoryDto);
  }

  @ApiOperation({ summary: 'Update a category by ID' })
  @ApiResponse({ status: 200, description: 'Category updated.' })
  @Put(':id')
  async update(@Param('id') id: number, @Body() updateCategoryDto: CreateCategoryDto) {
    return this._categoriesService.update(id, updateCategoryDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a category by ID' })
  @ApiResponse({ status: 204, description: 'Category deleted.' })
  async remove(@Param('id') id: number) {
    return this._categoriesService.remove(id);
  }
}

import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { PublicDataService } from './public-data.service';

@Controller('public-data')
export class PublicDataController {
  constructor(private readonly _publicDataService: PublicDataService) {}

  @Post('/search')
  async searchOnItems(@Body('query') query: string, @Query('limit') limit: number, @Query('offset') offset: number) {
    return this._publicDataService.searchOnItems(query, limit, offset);
  }

  @Get('/banners')
  async getBanners() {
    return this._publicDataService.getBanners();
  }

  @Get('/categories')
  async getCategories() {
    return this._publicDataService.getCategories();
  }

  @Get('/subscriptions')
  async getSubscriptions() {
    return this._publicDataService.getSubscriptions();
  }

  @Get('/popular-items')
  async getPopularItems() {
    return this._publicDataService.getPopularItems();
  }

  @Post('/temp')
  async createData() {
    return this._publicDataService.createData();
  }

  @Post('/temp/2')
  async insertCarHierarchy() {
    return this._publicDataService.insertCarHierarchy();
  }


  
  @Get('/temp/allCat')
  async getAllCategoriesWithSubcategories() {
    return this._publicDataService.getAllCategoriesWithSubcategories();
  }


  @Get('/temp/allCat/2')
  async getAllCategoriesWithSubcategories2() {
    return this._publicDataService.getAllCategoriesWithSubcategories2();
  }


  @Get('/temp/:id')
  async getCategoryAggregateData(@Param('id') id: string) {
    return this._publicDataService.getCategoryAggregateData(id);
  }

  
}

import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { PublicDataService } from './public-data.service';

@Controller('public-data')
export class PublicDataController {
  constructor(private readonly _publicDataService: PublicDataService) {}

  @Post('/search')
  async searchOnItems(
    @Body('query') query: string,
    @Query('limit') limit: number = 10,
    @Query('offset') offset: number = 0,
  ) {
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

  @Get('/featured-items')
  async getFeaturedItems() {
    return this._publicDataService.getFeaturedItems();
  }
}

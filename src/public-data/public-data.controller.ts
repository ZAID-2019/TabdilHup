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

  @Get('/item/:id')
  async getItemById(@Param('id') id: string) {
    return this._publicDataService.getItemById(id);
  }

  @Get('/user-profile/:id')
  async getUserProfileDataById(@Param('id') id: string) {
    return this._publicDataService.getUserProfileDataById(id);
  }

  /**
   * Get paginated user items
   * Endpoint: GET /users/:id/items?limit=10&offset=0
   */
  @Get('/user-profile/:id/items')
  async getUserItems(@Param('id') id: string, @Query('limit') limit?: number, @Query('offset') offset?: number) {
    return this._publicDataService.getUserItems(id, limit, offset);
  }

  /**
   * Get paginated user subscriptions
   * Endpoint: GET /users/:id/subscriptions?limit=5&offset=0
   */
  @Get('/user-profile/:id/subscriptions')
  async getUserSubscriptions(
    @Param('id') id: string,
    @Query('limit') limit?: number,
    @Query('offset') offset?: number,
  ) {
    return this._publicDataService.getUserSubscriptions(id, limit, offset);
  }

  @Get('/items/filter')
  async getItemsByFilter(
    @Query('category_id') category_id?: string | null,
    @Query('subcategory_id') subcategory_id?: string | null,
    @Query('limit') limit?: number,
    @Query('offset') offset?: number,
  ) {
    return this._publicDataService.getItemsByFilter(category_id,subcategory_id ,limit, offset);
  }
}

import {
  HttpException,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class PublicDataService {
  constructor(private readonly _prismaService: PrismaService) {}
  private readonly logger = new Logger(PublicDataService.name);

  async searchOnItems(query: string, limit: number = 10, offset: number = 0): Promise<unknown> {
    try {
      // Ensure limit and offset are valid numbers
      const take = Number(limit) || 10; // Default to 10 if limit is invalid
      const skip = Number(offset) || 0; // Default to 0 if offset is invalid
      const [itemsPromise, totalPromise] = await Promise.all([
        this._prismaService.item.findMany({
          select: {
            id: true,
            title: true,
          },
          where: {
            OR: [{ title: { contains: query , mode:'insensitive'} }, { description: { contains: query , mode:'insensitive'} }],
          },
          skip: skip,
          take: take,
        }),
        this._prismaService.item.count({
          where: {
            OR: [{ title: { contains: query, mode:'insensitive' } }, { description: { contains: query , mode:'insensitive'} }],
          },
        }),
      ]);

      // Await both promises
      const startTime = Date.now();
      const [items, total] = await Promise.all([itemsPromise, totalPromise]);
      const duration = Date.now() - startTime;

      this.logger.verbose(`Search query: "${query}" | Limit: ${limit} | Offset: ${offset}`);
      this.logger.verbose(`Search operation took ${duration} ms`);
      this.logger.verbose(`Successfully retrieved ${items.length} items out of ${total}`);

      return { items, total, status: 'success', message: 'Item Searched' };
    } catch (error) {
      // Log and handle error
      this.logger.error(`Error during search: ${error.message}`, error.stack);
      throw new HttpException(
        { status: 'error', message: 'An error occurred while searching', details: error.message },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
  async getBanners(): Promise<unknown> {
    try {
      const banners = await this._prismaService.item.findMany({
        select: {
          id: true,
          title: true,
          description: true,
          is_banner: true,
          user_id: true,
          user: { select: { first_name: true, last_name: true } },
          item_images: { select: { image_url: true } },
        },
        where: {
          deleted_at: null,
          is_banner: true,
          banners: {
            some: {
              is_active: true,
            },
          },
        },
      });
      this.logger.verbose(`Banners Successful Retrieved`);
      return { banners, status: 'success', message: 'Banners Successful Retrieved' };
    } catch (error) {
      // Log and handle error
      this.logger.error(`Error during get banners: ${error.message}`, error.stack);
      throw new HttpException(
        { status: 'error', message: 'An error occurred while getting banners', details: error.message },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
  async getCategories(): Promise<unknown> {
    try {
      const categories = await this._prismaService.category.findMany({
        where: { parent_id: null, deleted_at: null },
        select: {
          id: true,
          name_ar: true,
          name_en: true,
          description_ar: true,
          description_en: true,
          image_url: true,
          children: {
            select: {
              id: true,
              name_ar: true,
              name_en: true,
              description_ar: true,
              description_en: true,
              image_url: true,
            },
          },
        },
      });
      return { categories, status: 'success', message: 'Categories Successful Retrieved' };
    } catch (error) {
      this.logger.error(`Error during get categories: ${error.message}`, error.stack);
      throw new HttpException(
        { status: 'error', message: 'An error occurred while getting categories', details: error.message },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
  async getSubscriptions(): Promise<unknown> {
    try {
      const subscriptions = await this._prismaService.subscription.findMany({
        where: { category: 'REGULAR', status: 'ACTIVE', deleted_at: null },
        select: {
          id: true,
          title_ar: true,
          title_en: true,
          description_ar: true,
          description_en: true,
          price: true,
          offer_price: true,
          subscription_options: {
            select: {
              id: true,
              name_ar: true,
              name_en: true,
            },
          },
        },
      });
      return { subscriptions, status: 'success', message: 'Subscriptions Successful Retrieved' };
    } catch (error) {
      this.logger.error(`Error during get subscriptions: ${error.message}`, error.stack);
      throw new HttpException(
        { status: 'error', message: 'An error occurred while getting subscriptions', details: error.message },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getPopularItems(): Promise<unknown> {
    try {
      // Step 1: Fetch 5 categories
      const categories = await this._prismaService.category.findMany({
        take: 5, // Limit to 5 categories
        select: {
          id: true,
          name_ar: true,
          name_en: true,
          children: {
            select: {
              id: true,
              name_ar: true,
              name_en: true,
              description_ar: true,
              description_en: true,
              image_url: true,
            },
            where: { deleted_at: null }, // Exclude deleted children
          },
        },
        where: { parent_id: null, deleted_at: null },
      });

      // Step 2: Fetch last 5 items for each category
      const popularItems = await Promise.all(
        categories.map(async (category) => {
          const items = await this._prismaService.item.findMany({
            take: 5, // Limit to the last 5 items
            orderBy: { created_at: 'desc' }, // Order by most recent
            where: { category_id: category.id }, // Match category
            select: {
              id: true,
              title: true,
              description: true,
              item_images: {
                select: {
                  image_url: true,
                },
              },
            },
          });
          return {
            ...category,
            items,
          };
        }),
      );
      this.logger.verbose(`Popular Items Successfully Retrieved`);
      return { popularItems, status: 'success', message: 'Popular Items Successfully Retrieved' };
    } catch (error) {
      console.error(`Error retrieving popular items: ${error.message}`);
      throw new Error('Failed to retrieve popular items');
    }
  }

  async getItemsByFilter(
    category_id: string | null,
    subcategory_id: string | null,
    limit: number,
    offset: number,
  ): Promise<unknown> {
    try {
      limit = Number(limit) || 10;
      offset = Number(offset) || 0;

      // Build dynamic filter conditions
      const filterConditions: any = { deleted_at: null };

      if (category_id && category_id != "null") {
        filterConditions.category_id = category_id;
      }

      if (subcategory_id && subcategory_id != "null") { 
        filterConditions.subcategory_id = subcategory_id;
      }
      console.log({ filterConditions });
      
      const items = await this._prismaService.item.findMany({
        where: filterConditions,
        select: {
          id: true,
          title: true,
          description: true,
          item_images: {
            select: {
              image_url: true,
            },
          },
        },
        take: limit,
        skip: offset,
        orderBy: { created_at: 'desc' },
      });
      return { items, status: 'success', message: 'Items by Category Successfully Retrieved' };
    } catch (error) {
      this.logger.error(`Error during get items by category: ${error.message}`, error.stack);
      throw new HttpException(
        { status: 'error', message: 'An error occurred while getting items by category', details: error.message },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getItemById(id: string): Promise<unknown> {
    try {
      const result = await this._prismaService.item.findUnique({
        where: { id: id },
        select: {
          id: true,
          title: true,
          description: true,
          trade_value: true,
          condition: true,
          is_banner: true,
          category_id: true,
          subcategory_id: true,
          country_id: true,
          city_id: true,
          city: { select: { id: true, name_ar: true, name_en: true } },
          country: { select: { id: true, name_ar: true, name_en: true } },
          banners: { select: { id: true, start_date: true, end_date: true, is_active: true } },
          category: {
            select: {
              id: true,
              name_ar: true,
              name_en: true,
            },
          },
          subcategory: {
            select: {
              id: true,
              name_ar: true,
              name_en: true,
            },
          },
          item_images: {
            select: {
              id: true,
              image_url: true,
            },
          },
          user: {
            select: {
              id: true,
              first_name: true,
              last_name: true,
            },
          },
        },
      });
      this.logger.verbose(`Successfully Retrieved One Item`);
      const item = { ...result, trade_value: +result.trade_value };
      return { item, status: 'success', message: 'Find An Items' };
    } catch (error) {
      this.logger.error(`Error In Find Item By ID: ${error.message}`, error.stack);
      throw new HttpException(
        { status: 'error', message: 'An error occurred while getting items by Id', details: error.message },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
      // return ResponseUtil.error('An error occurred while searching for item', 'FIND_ONE_FAILED', error?.message);
    }
  }

  async getUserProfileDataById(id: string): Promise<unknown> {
    try {
      const user = await this._prismaService.user.findUnique({
        where: { id },
        select: {
          id: true,
          first_name: true,
          last_name: true,
          username: true,
          email: true,
          gender: true,
          role: true,
          status: true,
          profile_picture: true,
          birth_date: true,
          phone_number: true,
          created_at: true,
          updated_at: true,
          _count: {
            select: {
              items: true,
              user_subscriptions: true,
            },
          },
        },
      });

      if (!user) throw new NotFoundException('User not found');

      return {
        ...user,
        item_count: user._count.items,
        subscription_count: user._count.user_subscriptions,
      };
    } catch (error) {
      throw new InternalServerErrorException('Error fetching user profile', error.message);
    }
  }

  async getUserItems(id: string, limit?: number, offset?: number): Promise<unknown> {
    try {
      limit = Number(limit) || 10;
      offset = Number(offset) || 0;

      // Fetch items and count in parallel
      const [items, total] = await Promise.all([
        this._prismaService.item.findMany({
          where: { user_id: id, deleted_at: null }, // Only fetch active user items
          take: limit,
          skip: offset,
          select: {
            id: true,
            title: true,
            description: true,
            trade_value: true,
            condition: true,
            created_at: true,
            category_id: true,
            country_id: true,
            city_id: true,
            city: { select: { id: true, name_ar: true, name_en: true } },
            country: { select: { id: true, name_ar: true, name_en: true } },
            category: {
              select: {
                id: true,
                name_ar: true,
                name_en: true,
              },
            },
            item_images: {
              select: {
                id: true,
                image_url: true,
              },
            },
            user: {
              select: {
                id: true,
                first_name: true,
                last_name: true,
              },
            },
          },
          orderBy: { created_at: 'desc' }, // Show newest items first
        }),
        this._prismaService.item.count({
          where: { user_id: id, deleted_at: null }, // Count only user items
        }),
      ]);

      this.logger.verbose(`Successfully Retrieved ${items.length} Items for User ${id}`);
      return { items, total, status: 'success', message: 'Find All Items' };
    } catch (error) {
      this.logger.error(`Error In Fetching User Items: ${error.message}`, error.stack);
      throw new HttpException(
        { status: 'error', message: 'An error occurred while getting banners', details: error.message },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getUserSubscriptions(id: string, limit: number, offset: number): Promise<unknown> {
    try {
      limit = Number(limit) || 10;
      offset = Number(offset) || 0;
      const user_subscriptions = await this._prismaService.userSubscriptions.findMany({
        where: { user_id: id },
        select: {
          id: true,
          payment_details: true,
          start_date: true,
          end_date: true,
          subscription: {
            select: {
              title_ar: true,
              title_en: true,
              category: true,
              status: true,
              price: true,
            },
          },
        },
        take: limit,
        skip: offset,
      });
      this.logger.verbose(`User Subscriptions Successful Retrieved`);
      return { user_subscriptions, status: 'success', message: 'Find All User Subscriptions' };
    } catch (error) {
      this.logger.error(`Error Retrieved User Subscriptions : ${error.message}`, error.stack);
      throw new HttpException(
        { status: 'error', message: 'An error occurred while retrieved user subscriptions', details: error.message },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

}

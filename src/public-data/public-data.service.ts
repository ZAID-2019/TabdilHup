import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class PublicDataService {
  constructor(private readonly _prismaService: PrismaService) {}
  private readonly logger = new Logger(PublicDataService.name);

  async searchOnItems(query: string, limit: number, offset: number): Promise<unknown> {
    try {
      const [itemsPromise, totalPromise] = await Promise.all([
        this._prismaService.item.findMany({
          take: limit,
          skip: offset,
          select: {
            id: true,
            title: true,
          },
          where: {
            OR: [{ title: { contains: query } }, { description: { contains: query } }],
          },
        }),
        this._prismaService.item.count({
          where: {
            OR: [{ title: { contains: query } }, { description: { contains: query } }],
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
      const popularItemsCollection = await this._prismaService.category.findMany({
        where: { parent_id: null },
        select: {
          id: true,
          name_ar: true,
          name_en: true,
          children: {
            where: { deleted_at: null },
            select: {
              id: true,
              name_ar: true,
              name_en: true,
              items: {
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
              },
            },
          },
        },
      });

      const popularItems = popularItemsCollection.map((category) => {
        // Extract main category details
        const mainCategory = {
          id: category.id,
          name_ar: category.name_ar,
          name_en: category.name_en,
          items: [],
        };

        // Aggregate items from all children categories with items
        if (category.children && category.children.length > 0) {
          category.children.forEach((child) => {
            if (child.items && child.items.length > 0) {
              mainCategory.items.push(...child.items);
            }
          });
        }

        // Randomize and limit the items to 2
        mainCategory.items = mainCategory.items.sort(() => 0.5 - Math.random()).slice(0, 2);

        return mainCategory;
      });

      return { popularItems, status: 'success', message: 'Popular Items Successfully Retrieved' };
    } catch (error) {
      this.logger.error(`Error during get popular items: ${error.message}`, error.stack);
      throw new HttpException(
        { status: 'error', message: 'An error occurred while getting popular items', details: error.message },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getItemsByFilter(categoryId: string, limit: number, offset: number): Promise<unknown> {
    try {
      const category = await this._prismaService.category.findUnique({
        where: { id: categoryId },
        select: {
          id: true,
          name_ar: true,
          name_en: true,
          children: {
            select: {
              id: true,
              name_ar: true,
              name_en: true,
            },
          },
        },
      });
      console.log({ category });

      const items = await this._prismaService.item.findMany({
        where: { category_id: categoryId, deleted_at: null },
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
}

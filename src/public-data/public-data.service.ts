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
      const items = await this._prismaService.item.findMany({
        select: {
          id: true,
          title: true,
          description: true,
          is_banner: true,
          user_id: true,
          user: { select: { first_name: true, last_name: true } },
          itemImages: { select: { image_url: true } },
        },
        where: {
          deleted_at: null,
          is_banner: true,
          Banner: {
            some: {
              is_active: true,
            },
          },
        },
      });
      this.logger.verbose(`Banners Successful Retrieved`);
      return { items, status: 'success', message: 'Banners Successful Retrieved' };
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
        where: { parent_id: null , deleted_at: null },
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
        where: { category: 'REGULAR' , status: 'ACTIVE' , deleted_at: null },
        select: {
          id: true,
          title_ar: true,
          title_en: true,
          description_ar: true,
          description_en: true,
          price: true,
          offer_price: true,
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
  async getFeaturedItems(): Promise<unknown> {
    try {
       // Step 1: Fetch 3 random categories
    const mainCategories  = await this._prismaService.category.findMany({
      where: { deleted_at: null , parent_id: null },
      take: 5, // Number of categories to fetch
      orderBy: { created_at: 'desc' }, // Replace with custom random logic if needed
      select: {
        id: true,
        name_ar: true,
        name_en: true,
        description_ar: true,
        description_en: true,
        image_url: true,
        children:{
          select:{
            id: true,
            name_ar: true,
            name_en: true,
            description_ar: true,
            description_en: true,
          }
        }
      }
    });
    return {
      mainCategories,
      status: 'success',
      message: 'Featured Items Successfully Retrieved',
    };
    const featuredItems: any[] = [];

// Step 2: Fetch 5 random items for each category
await Promise.all(
  mainCategories.map(async (mainCategory) => {
    const subcategoriesWithItems = await Promise.all(
      mainCategory.children.map(async (subCategory) => {
        const items = await this._prismaService.item.findMany({
          where: { category_id: subCategory.id }, // Fetch items for subcategory
          select: {
            id: true,
            title: true,
            description: true,
            itemImages: true,
          },
          take: 5, // Limit items to 5 per subcategory
        });

        return {
          subCategoryName: subCategory,
          items, // Attach items to their respective subcategories
        };
      }),
    );
console.log({subcategoriesWithItems});

    // Combine the main category with its subcategories and items
    featuredItems.push({
      mainCategoryNameAr: mainCategory.name_ar,
      mainCategoryNameEn: mainCategory.name_en,
      items: subcategoriesWithItems,
    });
  }),
);

return {
  featuredItems,
  status: 'success',
  message: 'Featured Items Successfully Retrieved',
};


    }catch (error) {
      this.logger.error(`Error during get featured items: ${error.message}`, error.stack);
      throw new HttpException(
        { status: 'error', message: 'An error occurred while getting featured items', details: error.message },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

  }
}

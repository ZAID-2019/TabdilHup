import { Injectable, Logger } from '@nestjs/common';
import { ResponseUtil } from 'src/common/response.util';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateItemDto } from './create-item.dto';
import { faker } from '@faker-js/faker';
import { CreateBannerDto } from './create-banner.dto';

@Injectable()
export class ItemsService {
  constructor(private readonly _prismaService: PrismaService) {}

  private readonly logger = new Logger(ItemsService.name); // Initializes logger with the class name

  async findAll(limit?: number, offset?: number): Promise<unknown> {
    try {
      limit = Number(limit) || 10;
      offset = Number(offset) || 0;
      const [items, total] = await Promise.all([
        this._prismaService.item.findMany({
          where: { deleted_at: null, is_banner: false },
          take: limit,
          skip: offset,
          select: {
            id: true,
            title: true,
            description: true,
            trade_value: true,
            condition: true,
            is_banner: true,
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
          orderBy: {
            created_at: 'desc',
          },
        }),
        this._prismaService.item.count({
          where: { deleted_at: null },
        }),
      ]);

      this.logger.verbose(`Successfully Retrieved ${items.length} Items`);
      // return ResponseUtil.success('Find All Items', { items, total });
      return { items, total, status: 'success', message: 'Find All Items' };
    } catch (error) {
      this.logger.error(`Error In Find All Items: ${error.message}`, error.stack);
      return ResponseUtil.error('An error occurred while searching for items', 'FIND_ALL_FAILED', error?.message);
    }
  }

  async findAllBannersOLD(limit?: number, offset?: number): Promise<unknown> {
    try {
      limit = Number(limit) || 10;
      offset = Number(offset) || 0;
      const [items, total] = await Promise.all([
        this._prismaService.item.findMany({
          where: { deleted_at: null, is_banner: true },
          take: limit,
          skip: offset,
          select: {
            id: true,
            title: true,
            description: true,
            trade_value: true,
            condition: true,
            is_banner: true,
            category_id: true,
            country_id: true,
            banners: { select: { id: true, start_date: true, end_date: true, is_active: true } },
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
          orderBy: {
            created_at: 'desc',
          },
        }),
        this._prismaService.item.count({
          where: { deleted_at: null, is_banner: true },
        }),
      ]);

      this.logger.verbose(`Successfully Retrieved ${items.length} Items`);
      // return ResponseUtil.success('Find All Items', { items, total });
      return { items, total, status: 'success', message: 'Find All Items' };
    } catch (error) {
      this.logger.error(`Error In Find All Items: ${error.message}`, error.stack);
      return ResponseUtil.error('An error occurred while searching for items', 'FIND_ALL_FAILED', error?.message);
    }
  }

  async findAllBanners(limit?: number, offset?: number): Promise<unknown> {
    try {
      limit = Number(limit) || 10;
      offset = Number(offset) || 0;
      const [banners, total] = await Promise.all([
        this._prismaService.banner.findMany({
          where: { deleted_at: null, item: { is_banner: true } },
          take: limit,
          skip: offset,
          include: {
            item: {
              select: {
                id: true,
                title: true,
                description: true,
                trade_value: true,
                condition: true,
                is_banner: true,
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
            },
          },
          orderBy: {
            created_at: 'desc',
          },
        }),
        this._prismaService.item.count({
          where: { deleted_at: null, is_banner: true },
        }),
      ]);

      this.logger.verbose(`Successfully Retrieved ${banners.length} banners`);
      // return ResponseUtil.success('Find All Items', { items, total });
      return { banners, total, status: 'success', message: 'Find All banners' };
    } catch (error) {
      this.logger.error(`Error In Find All Items: ${error.message}`, error.stack);
      return ResponseUtil.error('An error occurred while searching for items', 'FIND_ALL_FAILED', error?.message);
    }
  }
  async findOne(id: string): Promise<unknown> {
    try {
      const item = await this._prismaService.item.findUnique({
        where: { id: id },
        select: {
          id: true,
          title: true,
          description: true,
          trade_value: true,
          condition: true,
          is_banner: true,
          category_id: true,
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
      // return ResponseUtil.success('Find Item By ID', item);
      return { item, status: 'success', message: 'Find An Items' };
    } catch (error) {
      this.logger.error(`Error In Find Item By ID: ${error.message}`, error.stack);
      return ResponseUtil.error('An error occurred while searching for item', 'FIND_ONE_FAILED', error?.message);
    }
  }

  async create(data: CreateItemDto): Promise<unknown> {
    try {
      const item = await this._prismaService.item.create({
        data: {
          title: data.title,
          description: data.description,
          country_id: data.country_id,
          city_id: data.city_id,
          condition: data.condition,
          trade_value: data.trade_value,
          user_id: data.user_id,
          is_banner: data.is_banner,
          category_id: data.category_id,
        },
      });

      // Save images associated with the newly created item
      if (data.image_urls && data.image_urls.length > 0) {
        await this._prismaService.itemImage.createMany({
          data: data.image_urls.map((url) => ({
            image_url: url,
            item_id: item.id, // Reference the item ID from the created item
          })),
        });
      }

      if (data.is_banner) {
        // Convert start_date to Date object if it's a string, or default to today's date
        const startDate = data.start_date ? new Date(data.start_date) : new Date();
        const [startYear, startMonth, startDay] = startDate.toISOString().split('T')[0].split('-');
        const formattedStartDate = new Date(`${startYear}-${startMonth}-${startDay}`);

        // Convert end_date to Date object if it's a string, or default to 7 days after start date
        const endDate = data.end_date
          ? new Date(data.end_date)
          : new Date(formattedStartDate.getTime() + 7 * 24 * 60 * 60 * 1000);
        const [endYear, endMonth, endDay] = endDate.toISOString().split('T')[0].split('-');
        const formattedEndDate = new Date(`${endYear}-${endMonth}-${endDay}`);

        // Create the banner
        await this._prismaService.banner.create({
          data: {
            item_id: item.id,
            is_active: true,
            start_date: formattedStartDate,
            end_date: formattedEndDate,
          },
        });
      }

      // return ResponseUtil.success('Item Created', item);
      return { item, status: 'success', message: 'Item Created' };
    } catch (error) {
      this.logger.error(`Error In Create Item: ${error.message}`, error.stack);
      return ResponseUtil.error('An error occurred while creating item', 'CREATE_FAILED', error?.message);
    }
  }

  async update(id: string, data: CreateItemDto): Promise<unknown> {
    try {
      // Update the main item details
      await this._prismaService.item.update({
        where: { id: id },
        data: {
          title: data.title,
          description: data.description,
          country_id: data.country_id,
          city_id: data.city_id,
          condition: data.condition,
          trade_value: data.trade_value,
          user_id: data.user_id,
          is_banner: data.is_banner,
          category_id: data.category_id,
        },
      });

      // Handle Images
      if (data.image_urls && data.image_urls.length > 0) {
        // Fetch existing images for the item
        const existingImages = await this._prismaService.itemImage.findMany({
          where: { item_id: id },
        });

        const existingImageUrls = existingImages.map((image) => image.image_url);
        const toCreate = data.image_urls.filter((url) => !existingImageUrls.includes(url));
        const toDelete = existingImageUrls.filter((url) => !data.image_urls.includes(url));

        // Delete unused images
        if (toDelete.length > 0) {
          await this._prismaService.itemImage.deleteMany({
            where: { image_url: { in: toDelete }, item_id: id },
          });
        }

        // Add new images
        if (toCreate.length > 0) {
          await this._prismaService.itemImage.createMany({
            data: toCreate.map((url) => ({
              image_url: url,
              item_id: id,
            })),
          });
        }
      }
      const result = await this.findOne(id);
      return result;
    } catch (error) {
      this.logger.error(`Error in updating item: ${error.message}`, error.stack);
      return ResponseUtil.error('An error occurred while updating the item', 'UPDATE_FAILED', error?.message);
    }
  }

  async updateBanner(id: string, updateBanner: CreateBannerDto): Promise<unknown> {
    try {
      await this._prismaService.banner.update({
        where: { id: id },
        data: {
          is_active: updateBanner.is_active,
          start_date: updateBanner.start_date ? new Date(updateBanner.start_date) : null, // Set to null if empty
        end_date: updateBanner.end_date ? new Date(updateBanner.end_date) : null, // Set to null if empty
        },
      });
      return { status: 'success', message: 'Banner Updated' };
    } catch (error) {
      this.logger.error(`Error in updating banner: ${error.message}`, error.stack);
      return ResponseUtil.error('An error occurred while updating the banner', 'UPDATE_FAILED', error?.message);
    }
  }


  async removeBanner(id: string): Promise<unknown> {
    try {
      await this._prismaService.banner.update({
        where: { id },
        data: {
          is_active: false,
          deleted_at: new Date(),
        },
      });
      return { status: 'success', message: 'Banner Deleted' };
    } catch (error) {
      this.logger.error(`Error in deleting banner: ${error.message}`, error.stack);
      return ResponseUtil.error('An error occurred while deleting the banner', 'DELETE_FAILED', error?.message);
    }
  }

  async findOneBanner(id:string): Promise<unknown> {
    try {
       const banner = await this._prismaService.banner.findUnique({
          where: { id: id, item: { is_banner: true } },
          include: {
            item: {
              select: {
                id: true,
                title: true,
                description: true,
                trade_value: true,
                condition: true,
                is_banner: true,
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
            },
          },
        });
      this.logger.verbose(`Successfully Retrieved One banner`);
      // return ResponseUtil.success('Find All Items', { items, total });
      return { banner,status: 'success', message: 'Find one banner' };
    } catch (error) {
      this.logger.error(`Error In Find All Items: ${error.message}`, error.stack);
      return ResponseUtil.error('An error occurred while searching for items', 'FIND_ALL_FAILED', error?.message);
    }
  }

  async update2(id: string, data: CreateItemDto): Promise<unknown> {
    try {
      const item = await this._prismaService.item.update({
        where: { id: id },
        data: {
          title: data.title,
          description: data.description,
          country_id: data.country_id,
          city_id: data.city_id,
          condition: data.condition,
          trade_value: data.trade_value,
          user_id: data.user_id,
          is_banner: data.is_banner,
          category_id: data.category_id,
        },
      });
      // return ResponseUtil.success('Item Updated', item);
      return { item, status: 'success', message: 'Item Updated' };
    } catch (error) {
      this.logger.error(`Error In Update Item: ${error.message}`, error.stack);
      return ResponseUtil.error('An error occurred while updating item', 'UPDATE_FAILED', error?.message);
    }
  }

  async remove(id: string): Promise<unknown> {
    try {
      const item = await this._prismaService.item.update({
        where: { id: id },
        data: {
          deleted_at: new Date(),
        },
      });

      // Check if the item is a banner
      const isBanner = await this._prismaService.banner.findMany({
        where: {
          item_id: id,
          is_active: true, // Only check active banners
          deleted_at: null, // Ensure it's not soft-deleted
        },
      });

      if (isBanner.length > 0) {
        // Deactivate the banner
        await this._prismaService.banner.updateMany({
          where: {
            item_id: id,
          },
          data: {
            is_active: false,
          },
        });
      }
      // return ResponseUtil.success('Item Deleted', item);
      return { item, status: 'success', message: 'Item Deleted' };
    } catch (error) {
      this.logger.error(`Error In Delete Item: ${error.message}`, error.stack);
      return ResponseUtil.error('An error occurred while deleting item', 'DELETE_FAILED', error?.message);
    }
  }

  async createMultiple(data: CreateItemDto): Promise<unknown> {
    const batchSize = 1000; // Define the batch size
    const items = [];

    // Create all 500,000 item records in memory
    for (let index = 0; index <= 500000; index++) {
      items.push({
        ...data,
        title: faker.commerce.productName(), // Generates random item names
        description: faker.commerce.productDescription(),
      });
    }

    // Insert items in batches
    for (let i = 0; i < items.length; i += batchSize) {
      const batch = items.slice(i, i + batchSize); // Get a batch of items

      await this._prismaService.item.createMany({
        data: batch,
        skipDuplicates: true, // Optional: Skip records with duplicate unique fields
      });

      // console.log(`Inserted batch ${i / batchSize + 1}`);
    }

    return { message: 'Batch insertion completed' };
  }

  async createMultiple22(data: CreateItemDto): Promise<unknown> {
    const arabicItems = [
      { title: 'كتاب', description: 'كتاب يحتوي على معلومات ومواضيع مختلفة.' },
      { title: 'قلم', description: 'أداة للكتابة تُستخدم على الورق.' },
      { title: 'كرسي', description: 'مقعد مخصص للجلوس.' },
      { title: 'طاولة', description: 'سطح مستوٍ يُستخدم لوضع الأشياء عليه.' },
      { title: 'هاتف', description: 'جهاز يستخدم للتواصل عن بعد.' },
      { title: 'حاسوب', description: 'جهاز إلكتروني يُستخدم لمعالجة المعلومات.' },
      { title: 'ساعة', description: 'جهاز يُستخدم لقياس الوقت.' },
      { title: 'نظارات', description: 'أداة لتصحيح الرؤية أو الحماية من أشعة الشمس.' },
      // Add more items as needed
    ];

    const batchSize = 1000; // Define the batch size
    const items = [];

    // Generate 500,000 item records
    for (let index = 0; index < 500000; index++) {
      // Randomly select an item from the arabicItems array
      const randomItem = arabicItems[Math.floor(Math.random() * arabicItems.length)];

      // Push the generated item into the items array
      items.push({
        ...data,
        title: randomItem.title, // Use a random title
        description: randomItem.description, // Use a random description
      });

      // Insert items in batches
      for (let i = 0; i < items.length; i += batchSize) {
        const batch = items.slice(i, i + batchSize); // Get a batch of items

        await this._prismaService.item.createMany({
          data: batch,
          skipDuplicates: true, // Optional: Skip records with duplicate unique fields
        });

        // console.log(`Inserted batch ${i / batchSize + 1}`);
      }
    }

    return { message: 'Batch insertion completed' };
  }

  async createMultiple2(data: CreateItemDto): Promise<unknown> {
    const arabicItems = [
      {
        title: 'كتاب',
        description: 'كتاب يحتوي على معلومات ومواضيع مختلفة.',
      },
      {
        title: 'قلم',
        description: 'أداة للكتابة تُستخدم على الورق.',
      },
      {
        title: 'كرسي',
        description: 'مقعد مخصص للجلوس.',
      },
      {
        title: 'طاولة',
        description: 'سطح مستوٍ يُستخدم لوضع الأشياء عليه.',
      },
      {
        title: 'هاتف',
        description: 'جهاز يستخدم للتواصل عن بعد.',
      },
      {
        title: 'حاسوب',
        description: 'جهاز إلكتروني يُستخدم لمعالجة المعلومات.',
      },
      {
        title: 'ساعة',
        description: 'جهاز يُستخدم لقياس الوقت.',
      },
      {
        title: 'نظارات',
        description: 'أداة لتصحيح الرؤية أو الحماية من أشعة الشمس.',
      },
      {
        title: 'سرير',
        description: 'أثاث يُستخدم للنوم والاستراحة.',
      },
      {
        title: 'غطاء',
        description: 'قطعة قماش تُستخدم لتغطية السرير أو الجسم.',
      },
      {
        title: 'ثلاجة',
        description: 'جهاز يستخدم لتبريد وتخزين الأطعمة.',
      },
      {
        title: 'ميكروويف',
        description: 'جهاز يُستخدم لتسخين الطعام بسرعة.',
      },
      {
        title: 'فرن',
        description: 'جهاز يُستخدم لطهي وخبز الطعام.',
      },
      {
        title: 'غسالة',
        description: 'جهاز يُستخدم لغسل الملابس.',
      },
      {
        title: 'مروحة',
        description: 'جهاز يُستخدم لتوليد الهواء البارد.',
      },
      {
        title: 'مكيف',
        description: 'جهاز يُستخدم لتبريد الهواء في الأماكن المغلقة.',
      },
      {
        title: 'لوحة',
        description: 'سطح مسطح يُستخدم للكتابة أو الرسم عليه.',
      },
      {
        title: 'ممحاة',
        description: 'أداة تُستخدم لإزالة الكتابات بالقلم.',
      },
      {
        title: 'مقص',
        description: 'أداة تستخدم لقص الورق أو الأقمشة.',
      },
      {
        title: 'عطر',
        description: 'سائل يُستخدم لإضفاء رائحة عطرة.',
      },
      {
        title: 'زجاجة',
        description: 'وعاء مصنوع من الزجاج يُستخدم لحفظ السوائل.',
      },
      {
        title: 'سماعات',
        description: 'أداة تُستخدم للاستماع إلى الصوت.',
      },
      {
        title: 'كاميرا',
        description: 'جهاز يُستخدم لالتقاط الصور.',
      },
      {
        title: 'جهاز تحكم',
        description: 'جهاز يُستخدم للتحكم في الأجهزة الإلكترونية.',
      },
      {
        title: 'طابعة',
        description: 'جهاز يُستخدم لطباعة المستندات والصور.',
      },
      {
        title: 'مسطرة',
        description: 'أداة تُستخدم لقياس الطول أو رسم الخطوط المستقيمة.',
      },
      {
        title: 'فنجان',
        description: 'وعاء صغير يُستخدم لشرب القهوة أو الشاي.',
      },
      {
        title: 'صحن',
        description: 'وعاء مسطح يُستخدم لتقديم الطعام.',
      },
      {
        title: 'ملعقة',
        description: 'أداة تُستخدم لتناول الطعام أو الخلط.',
      },
      {
        title: 'عصير',
        description: 'مشروب مصنوع من فواكه طبيعية.',
      },
      {
        title: 'فواكه',
        description: 'أغذية طبيعية تُستخدم كوجبات خفيفة.',
      },
      {
        title: 'خضار',
        description: 'نباتات صالحة للأكل تُستخدم في الطهي.',
      },
      {
        title: 'لحم',
        description: 'مصادر بروتينية تُستخدم في إعداد الوجبات.',
      },
      {
        title: 'جبنة',
        description: 'منتج ألبان يُستخدم في العديد من الأطباق.',
      },
      {
        title: 'عسل',
        description: 'مادة حلوة تنتجها النحل وتُستخدم غذاء.',
      },
      {
        title: 'دجاج',
        description: 'نوع من اللحوم التي تعتبر شعبية في الطهي.',
      },
      {
        title: 'ماء',
        description: 'السائل الأساسي للحياة ويستخدم للشرب.',
      },
      {
        title: 'طعام',
        description: 'مواد غذائية تُستخدم لإشباع الجوع.',
      },
      {
        title: 'حقيبة',
        description: 'وعاء يحمل الأشياء والمواد.',
      },
      {
        title: 'سلة',
        description: 'حاوية تُستخدم لتخزين الأشياء.',
      },
      {
        title: 'حذاء',
        description: 'غطاء يُرتدى في القدم.',
      },
      {
        title: 'غسالة الصحون',
        description: 'جهاز يُستخدم لغسل الأواني والأطباق تلقائيًا.',
      },
      {
        title: 'بيجامة',
        description: 'ملابس تُرتدى للنوم أو للراحة.',
      },
      {
        title: 'جاكيت',
        description: 'ملابس خارجية تُرتدى فوق الملابس الأخرى.',
      },
      {
        title: 'قبعة',
        description: 'غطاء للرأس يُستخدم للحماية من الشمس.',
      },
      {
        title: 'بطانية',
        description: 'قطعة قماش تُستخدم للتدفئة.',
      },
      {
        title: 'وسادة',
        description: 'مادة تُستخدم لدعم الرأس أثناء النوم.',
      },
      {
        title: 'سجاد',
        description: 'قطعة من النسيج تُستخدم لتزيين الأرض.',
      },
      {
        title: 'شامبو',
        description: 'منتج يُستخدم لتنظيف الشعر.',
      },
      {
        title: 'غسول',
        description: 'منتج يُستخدم لتنظيف البشرة.',
      },
      {
        title: 'مرآة',
        description: 'سطح عاكس يُستخدم لرؤية الوجه أو الجسم.',
      },
      {
        title: 'عدسة',
        description: 'جهاز يُستخدم لتحسين الرؤية.',
      },
      {
        title: 'لعبة',
        description: 'شيء يُستخدم للترفيه واللعب.',
      },
      {
        title: 'دراجة',
        description: 'وسيلة نقل على عجلتين.',
      },
      {
        title: 'سيارة',
        description: 'وسيلة نقل مُحركة تُستخدم للسفر.',
      },
      {
        title: 'سفن',
        description: 'وسائل نقل مُصممة للإبحار في الماء.',
      },
      {
        title: 'الطائرة',
        description: 'وسيلة نقل جوية تُستخدم للربط بين المدن.',
      },
      {
        title: 'سلة الكتف',
        description: 'حقيبة صغيرة تُحمل على الكتف لحمل الأغراض.',
      },
      // Continue adding items to complete the array up to 1000
    ];
    const arabicItems2 = [
      ...arabicItems,
      { title: 'خريطة قديمة', description: 'خريطة توضح الطرقات والممرات في البرية.' },
      { title: 'مدفع بخاري', description: 'مدفع يستخدم للقضاء على المخاطر في المناطق النائية.' },
      { title: 'عربة الغجر', description: 'عربة صغيرة مخصصة للرحالة والبدو.' },
      { title: 'حصان عربي', description: 'حصان سريع ومتأقلم مع الصحراء.' },
      { title: 'خيمة مسافرين', description: 'خيمة خفيفة الوزن وسهلة للنقل.' },
      { title: 'فأس', description: 'أداة لحفر الأرض أو قطع الأشجار.' },
      { title: 'قوس وسهم', description: 'أداة للصيد وصنع الأسلحة.' },
      { title: 'غذاء مجفف', description: 'طعام محفوظ لرحلات الطوال.' },
      { title: 'منظار', description: 'عدسة مكبرة لمشاهدة مسافات بعيدة.' },
      { title: 'حبل متين', description: 'حبل يستخدم لأغراض متعددة في المعسكرات.' },
      { title: 'علبة إسعافات أولية', description: 'مجموعة أدوات لعلاج الإصابات.' },
      { title: 'موقد محمول', description: 'موقد يستخدم للطهي أثناء التنقل.' },
      { title: 'سلة تضم أدوات الصيد', description: 'سلة تحتوي على أدوات الصيد الأساسية.' },
      { title: 'دليل النجوم', description: 'كتاب يعلم كيفية الملاحة باستخدام النجوم.' },
      { title: 'حقيبة ظهر', description: 'حقيبة لحمل المستلزمات أثناء الرحلات.' },
      { title: 'شمسية حماية', description: 'أداة لحماية من الشمس أثناء التنقل.' },
      { title: 'سترة واقية', description: 'سترة توفر الحماية الشخصي.' },
      { title: 'كاميرا قديمة', description: 'كاميرا لتوثيق المغامرات والتجارب.' },
      { title: 'صيد السمك', description: 'أدوات لصيد الأسماك من الأنهار أو البحيرات.' },
      { title: 'مفتاح أوروبي', description: 'أداة تفتح الأبواب المغلقة.' },
      { title: 'طاولة قابلة للطي', description: 'طاولة خفيفة ومحمولة.' },
      { title: 'مقعد خشبي', description: 'مقعد للاسترخاء بالقرب من النار.' },
      { title: 'علبة أدوات النجارة', description: 'أدوات لإنشاء الإصلاحات اللازمة.' },
      { title: 'حيوان أليف', description: 'رفيق في الرحلات عبر البرية.' },
      { title: 'صندوق الكنز', description: 'صندوق لحفظ الأشياء الثمينة.' },
      { title: 'سفينة شراعية', description: 'سفينة تستخدم للتنقل عبر المياه.' },
      { title: 'قناع تنفس', description: 'قناع لحماية الوجه أثناء العواصف الرملية.' },
      { title: 'أضواء ساطعة', description: 'أداة لإضاءة الليل.' },
      { title: 'صخرة حادة', description: 'صخرة تستخدم كأداة قطع.' },
      { title: 'قنينة المياه', description: 'لحفظ المياه في الرحلات.' },
      { title: 'تلسكوب', description: 'لرؤية الأجرام السماوية.' },
      { title: 'دليل الحيوانات', description: 'كتاب يصف أنواع الحيوانات في المنطقة.' },
      { title: 'حافظة الطعام', description: 'لحفظ الطعام الطازج أثناء التنقل.' },
      { title: 'حقيبة أدوات', description: 'حقيبة مخصصة لحمل الأدوات اللازمة.' },
      { title: 'نقود معدنية', description: 'للشراء في المعسكرات.' },
      { title: 'جهاز ملاحة', description: 'جهاز يساعد في تحديد الاتجاهات.' },
      { title: 'ماكينة حلاقة', description: 'للحفاظ على مظهر جيد في الرحلات.' },
      { title: 'دلو', description: 'حاوية لجمع المياه أو نقل الأشياء.' },
      { title: 'شجرة خشبية', description: 'شفافة تستخدم في بناء الملاجئ.' },
      { title: 'مصباح يدوي', description: 'للإضاءة في الأماكن المظلمة.' },
      { title: 'جوارب صوفية', description: 'للحفاظ على القدمين دافئة.' },
      { title: 'خريطة مذهلة', description: 'خريطة للجغرافيّة المحلية.' },
      { title: 'شجرة فواكه', description: 'مصدر طبيعي للغذاء.' },
      { title: 'مفك براغي', description: 'مفتاح لإصلاح المعدات.' },
      { title: 'قتال بقبضات', description: 'لزيادة المهارات القتالية.' },
      { title: 'قارب', description: 'للنقل عبر الأنهار والبحيرات.' },
      { title: 'قفازات جلدية', description: 'لحماية اليدين أثناء العمل الشاق.' },
      { title: 'سماد طبيعي', description: 'للتربة وتحسين المزروعات.' },
      { title: 'منارة', description: 'دليل لمساعدة السفن في المياه.' },
      { title: 'سفينة تجارية', description: 'للنقل التجاري عبر المحيطات.' },
      { title: 'بندقية قنص', description: 'لصيد الحيوانات الكبيرة.' },
      { title: 'سيارة رباعية الدفع', description: 'للسير عبر التضاريس الوعرة.' },
      { title: 'دلاء رملية', description: 'للمشي على الشاطئ.' },
      { title: 'معدات طهي', description: 'لتحضير الطعام في البرية.' },
      { title: 'درع حماية', description: 'لحماية جسمك من الأذى.' },
      { title: 'جراب سلاح', description: 'لحمل السلاح بأمان.' },
      { title: 'كشافات النجاح', description: 'الأدوات المستخدمة في صيد الأسماك.' },
      { title: 'بذور نباتات', description: 'لزراعة المحاصيل في المواسم.' },
      { title: 'أدوات خاصة لاستكشاف', description: 'أدوات تحتاجها لاستكشاف المناطق الجديدة.' },
      { title: 'خزينة', description: 'لحفظ الأموال والممتلكات الثمينة.' },
      { title: 'دليل الطرق', description: 'كتاب يحتوي على معلومات عن طرق السير.' },
      { title: 'لوحة رسم', description: 'لوحة تُستخدم للرسم في الطبيعة.' },
      { title: 'كتب تحتوي على نصائح البقاء', description: 'كتب تُساعد في كيفية البقاء على قيد الحياة.' },
      { title: 'مرافق طبي', description: 'للرعاية الطبية في الرحلات.' },
      { title: 'فطائر محلية', description: 'طعامة تُحضر في المعسكرات.' },
      { title: 'كنز دفين', description: 'كنز مفقود يتطلب البحث.' },
    ];
    // console.log({ arabicItems });
    // console.log({ arabicItems2 });

    // Example of how you might use this array in your code
    const batchSize = 1000; // Define the batch size
    const items = [];
    const totalItems = 100; // Total items to insert

    // Create all 500,000 item records in memory
    for (let index = 0; index < totalItems; index++) {
      // Get a random index for the arabicItems array
      const randomIndex = Math.floor(Math.random() * arabicItems2.length);
      const { title, description } = arabicItems2[randomIndex]; // Get random item from the array

      items.push({
        ...data,
        title: title, // Use the Arabic name as title
        description: description, // Use the Arabic description
      });
    }

    // Insert items in batches
    for (let i = 0; i < items.length; i += batchSize) {
      const batch = items.slice(i, i + batchSize); // Get a batch of items

      await this._prismaService.item.createMany({
        data: batch,
        skipDuplicates: true, // Optional: Skip records with duplicate unique fields
      });

      console.log(`Inserted batch ${i / batchSize + 1}`);
    }

    return { message: 'Batch insertion completed' };
  }

  // Search for items
  async search(query: string): Promise<unknown> {
    try {
      const limit = 10; // Default limit to 10 if not provided
      const offset = 0; // Changed to 0 for proper pagination

      // Fetch the items based on the query
      const itemsPromise = this._prismaService.item.findMany({
        take: limit,
        skip: offset,
        select: {
          id: true,
          title: true,
          description: true,
          trade_value: true,
          condition: true,
          is_banner: true,
          category_id: true,
          country_id: true,
          city_id: true,
          user_id: true,
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
              image_url: true,
            },
          },
        },
        where: {
          OR: [
            { title: { contains: query } }, // Search by title
            { description: { contains: query } }, // Search by description
          ],
        },
      });

      // Count the total number of items that match the query without pagination
      const totalPromise = this._prismaService.item.count({
        where: {
          OR: [{ title: { contains: query } }, { description: { contains: query } }],
        },
      });

      // Await both promises
      const startTime = Date.now();
      const [items, total] = await Promise.all([itemsPromise, totalPromise]);
      const duration = Date.now() - startTime;
      this.logger.verbose(`Search operation took ${duration} ms`);
      this.logger.verbose(`Successfully Retrieved ${items.length} Items`);
      // return ResponseUtil.success('Search Items', { items, total });
      return { items, total, status: 'success', message: 'Item Deleted' };
    } catch (error) {
      this.logger.error(`Error In Search Items: ${error.message}`, error.stack);
      return ResponseUtil.error('An error occurred while searching for items', 'SEARCH_FAILED', error?.message);
    }
  }
}

import { Injectable, Logger } from '@nestjs/common';
import { ResponseUtil } from 'src/common/response.util';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateCategoryDto } from './create-category.dto';

@Injectable()
export class CategoriesService {
  constructor(private readonly _prismaService: PrismaService) {}

  private readonly logger = new Logger(CategoriesService.name); // Initializes logger with the class name

  async findAll(limit?: number, offset?: number): Promise<unknown> {
    try {
      limit = Number(limit) || 10;
      offset = Number(offset) || 0;
      const [categories, total] = await Promise.all([
        this._prismaService.category.findMany({
          where: { deleted_at: null, parent_id: null },
          take: limit,
          skip: offset,
          select: {
            id: true,
            name_ar: true,
            name_en: true,
            description_ar: true,
            description_en: true,
            image_url: true,
            children: {
              where: { deleted_at: null },
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
          orderBy: {
            id: 'desc',
          },
        }),
        this._prismaService.category.count({
          where: { deleted_at: null },
        }),
      ]);

      this.logger.verbose(`Successfully Retrieved ${categories.length} Categories`);
      return {categories, total,status: 'success', message: 'Find All Categories'};
      // return ResponseUtil.success('Find All Categories', categories);
    } catch (error) {
      this.logger.error(`Error In Find All Categories: ${error.message}`, error.stack);
      return ResponseUtil.error(
        'An error occurred while searching for Categories',
        'FIND_ALL_FAILED',
        error?.message,
        404,
      );
    }
  }

  async findOne(id: number): Promise<unknown> {
    try {
      const category = await this._prismaService.category.findUnique({
        where: { id: Number(id) },
      });
      return ResponseUtil.success('Find Category By ID', category);
    } catch (error) {
      this.logger.error(`Error In Find Category By ID: ${error.message}`, error.stack);
      return ResponseUtil.error('An error occurred while searching for category', 'FIND_ONE_FAILED', error?.message);
    }
  }

  async create(data: CreateCategoryDto): Promise<unknown> {
    try {
      const category = await this._prismaService.category.create({
        data: {
          name_ar: data.name_ar,
          name_en: data.name_en,
          description_ar: data.description_ar,
          description_en: data.description_en,
          image_url: data.image_url,
          parent_id: data.parent_id,
        },
      });
      return ResponseUtil.success('Category Created', category, 201);
    } catch (error) {
      this.logger.error(`Error In Create Category: ${error.message}`, error.stack);
      return ResponseUtil.error('An error occurred while creating category', 'CREATE_FAILED', error?.message);
    }
  }

  async update(id: number, data: CreateCategoryDto): Promise<unknown> {
    try {
      const category = await this._prismaService.category.update({
        where: { id: Number(id) },
        data: {
          name_ar: data.name_ar,
          name_en: data.name_en,
          description_ar: data.description_ar,
          description_en: data.description_en,
          image_url: data.image_url,
          parent_id: data.parent_id,
        },
      });
      return ResponseUtil.success('Category Updated', category);
    } catch (error) {
      this.logger.error(`Error In Update Category: ${error.message}`, error.stack);
      return ResponseUtil.error('An error occurred while updating category', 'UPDATE_FAILED', error?.message , 400);
    }
  }

  async remove(id: number): Promise<unknown> {
    try {
      await this._prismaService.category.update({
        where: { id: Number(id) },
        data: {
          deleted_at: new Date(),
        },
      });
      return ResponseUtil.success('Category deleted successfully', null, 204);
    } catch (error) {
      this.logger.error(`Error In Delete Category: ${error.message}`, error.stack);
      return ResponseUtil.error('An error occurred while deleting category', 'DELETE_FAILED', error?.message , 400);
    }
  }
}

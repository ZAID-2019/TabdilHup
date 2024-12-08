import { Injectable, Logger } from '@nestjs/common';
import { ResponseUtil } from 'src/common/response.util';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateCategoryDto } from './create-category.dto';

@Injectable()
export class CategoriesService {
  constructor(private readonly _prismaService: PrismaService) {}

  private readonly logger = new Logger(CategoriesService.name);

  async findAll(limit?: number, offset?: number): Promise<unknown> {
    try {
      limit = Number(limit) || 1000;
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
            parent_id: true,
          },
          orderBy: {
            created_at: 'desc',
          },
        }),
        this._prismaService.category.count({
          where: { deleted_at: null },
        }),
      ]);

      this.logger.verbose(`Successfully Retrieved ${categories.length} Categories`);
      return { categories, total, status: 'success', message: 'Find All Categories' };
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

  async findAllSub(limit?: number, offset?: number): Promise<unknown> {
    try {
      limit = Number(limit) || 1000;
      offset = Number(offset) || 0;
      const [categories, total] = await Promise.all([
        this._prismaService.category.findMany({
          where: { deleted_at: null, parent_id: { not: null } },
          take: limit,
          skip: offset,
          select: {
            id: true,
            name_ar: true,
            name_en: true,
            description_ar: true,
            description_en: true,
            image_url: true,
            parent_id: true,
          },
          orderBy: {
            created_at: 'desc',
          },
        }),
        this._prismaService.category.count({
          where: { deleted_at: null },
        }),
      ]);

      this.logger.verbose(`Successfully Retrieved ${categories.length} Categories`);
      return { categories, total, status: 'success', message: 'Find All Sub Categories' };
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

  async findAllSubByCategory(id: string, limit?: number, offset?: number): Promise<unknown> {
    try {
      limit = Number(limit) || 1000;
      offset = Number(offset) || 0;
      const [categories, total] = await Promise.all([
        this._prismaService.category.findMany({
          where: { deleted_at: null, parent_id:id },
          take: limit,
          skip: offset,
          select: {
            id: true,
            name_ar: true,
            name_en: true,
            description_ar: true,
            description_en: true,
            image_url: true,
            parent_id: true,
          },
          orderBy: {
            created_at: 'desc',
          },
        }),
        this._prismaService.category.count({
          where: { deleted_at: null },
        }),
      ]);
      this.logger.verbose(`Successfully Retrieved ${categories.length} Categories`);
      return { categories, total, status: 'success', message: 'Find All Sub Categories' };
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

  async findOne(id: string): Promise<unknown> {
    try {
      const category = await this._prismaService.category.findUnique({
        where: { id: id },
      });
      return { category, status: 'success', message: 'Find A Category' };
      // return ResponseUtil.success('Find Category By ID', category);
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

  async update(id: string, data: CreateCategoryDto): Promise<unknown> {
    try {
      const category = await this._prismaService.category.update({
        where: { id: id },
        data: {
          name_ar: data.name_ar,
          name_en: data.name_en,
          description_ar: data.description_ar,
          description_en: data.description_en,
          image_url: data.image_url,
          parent_id: data.parent_id,
        },
      });
      return { category, status: 'success', message: 'Category Updated Successfully' };
      // return ResponseUtil.success('Category Updated', category);
    } catch (error) {
      this.logger.error(`Error In Update Category: ${error.message}`, error.stack);
      return ResponseUtil.error('An error occurred while updating category', 'UPDATE_FAILED', error?.message, 400);
    }
  }

  async remove(id: string): Promise<unknown> {
    try {
      await this._prismaService.category.update({
        where: { id: id },
        data: {
          deleted_at: new Date(),
        },
      });
      return { status: 'success', message: 'Category Deleted Successfully' };
      // return ResponseUtil.success('Category deleted successfully', null, 204);
    } catch (error) {
      this.logger.error(`Error In Delete Category: ${error.message}`, error.stack);
      return ResponseUtil.error('An error occurred while deleting category', 'DELETE_FAILED', error?.message, 400);
    }
  }
}

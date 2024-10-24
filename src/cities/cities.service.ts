import { Injectable, Logger } from '@nestjs/common';
import { ResponseUtil } from 'src/common/response.util';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateCityDto } from './create-city.dto';

@Injectable()
export class CitiesService {
  constructor(private readonly _prismaService: PrismaService) {}

  private readonly logger = new Logger(CitiesService.name); // Initializes logger with the class name

  async findAll(limit?: number, offset?: number): Promise<unknown> {
    try {
      limit = Number(limit) || 10;
      offset = Number(offset) || 0;
      const [cities, total] = await Promise.all([
        this._prismaService.city.findMany({
          where: { deleted_at: null },
          take: limit,
          skip: offset,
          select: {
            id: true,
            name_ar: true,
            name_en: true,
            country: {
              select: {
                id: true,
                name_ar: true,
                name_en: true,
              },
            },
          },
          orderBy: {
            id: 'desc',
          },
        }),
        this._prismaService.city.count({
          where: { deleted_at: null },
        }),
      ]);

      this.logger.verbose(`Successfully Retrieved ${cities.length} Cities`);
      return ResponseUtil.success('Find All Cities', { cities, total });
    } catch (error) {
      this.logger.error(`Error In Find All Cities: ${error.message}`, error.stack);
      return ResponseUtil.error('An error occurred while searching for cities', 'FIND_ALL_FAILED', error?.message);
    }
  }

  async findOne(id: number): Promise<unknown> {
    try {
      const city = await this._prismaService.city.findUnique({
        where: { id: Number(id) },
      });
      return ResponseUtil.success('Find City By ID', city);
    } catch (error) {
      this.logger.error(`Error In Find City By ID: ${error.message}`, error.stack);
      return ResponseUtil.error('An error occurred while searching for city', 'FIND_ONE_FAILED', error?.message);
    }
  }

  async create(data: CreateCityDto): Promise<unknown> {
    try {
      const city = await this._prismaService.city.create({
        data: {
          name_ar: data.name_ar,
          name_en: data.name_en,
          country_id: data.country_id,
        },
      });
      return ResponseUtil.success('City Created', city);
    } catch (error) {
      this.logger.error(`Error In Create City: ${error.message}`, error.stack);
      return ResponseUtil.error('An error occurred while creating city', 'CREATE_FAILED', error?.message);
    }
  }

  async update(id: number, data: CreateCityDto): Promise<unknown> {
    try {
      const city = await this._prismaService.city.update({
        where: { id: Number(id) },
        data: {
          name_ar: data.name_ar,
          name_en: data.name_en,
        },
      });
      return ResponseUtil.success('City Updated', city);
    } catch (error) {
      this.logger.error(`Error In Update City: ${error.message}`, error.stack);
      return ResponseUtil.error('An error occurred while updating city', 'UPDATE_FAILED', error?.message);
    }
  }

  async remove(id: number): Promise<unknown> {
    try {
      const city = await this._prismaService.city.update({
        where: { id: Number(id) },
        data: {
          deleted_at: new Date(),
        },
      });
      return ResponseUtil.success('City Deleted', city);
    } catch (error) {
      this.logger.error(`Error In Delete City: ${error.message}`, error.stack);
      return ResponseUtil.error('An error occurred while deleting city', 'DELETE_FAILED', error?.message);
    }
  }
}

import { Injectable, Logger } from '@nestjs/common';
import { ResponseUtil } from 'src/common/response.util';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateCountryDto } from './create-country.dto';

@Injectable()
export class CountriesService {
  constructor(private readonly _prismaService: PrismaService) {}

  private readonly logger = new Logger(CountriesService.name); // Initializes logger with the class name

  async findAll(limit?: number, offset?: number): Promise<unknown> {
    try {
      limit = Number(limit) || 10;
      offset = Number(offset) || 0;
      const [countries, total] = await Promise.all([
        this._prismaService.country.findMany({
          where: { deleted_at: null },
          take: limit,
          skip: offset,
          select: {
            id: true,
            name_ar: true,
            name_en: true,
            city: {
              select: {
                id: true,
                name_ar: true,
                name_en: true,
              }
            }
          },
          orderBy: {
            id: 'desc',
          },
        }),
        this._prismaService.country.count({
          where: { deleted_at: null },
        }),
      ]);

      this.logger.verbose(`Successfully Retrieved ${countries.length} Countries`);
      return ResponseUtil.success('Find All Countries', { countries, total });
    } catch (error) {
      this.logger.error(`Error In Find All Countries: ${error.message}`, error.stack);
      return ResponseUtil.error('An error occurred while searching for countries', 'FIND_ALL_FAILED', error?.message);
    }
  }

  async findOne(id: number): Promise<unknown> {
    try {
      const country = await this._prismaService.country.findUnique({
        where: { id: Number(id) , deleted_at: null},
        select: {
          id: true,
          name_ar: true,
          name_en: true,
          city: {
            select: {
              id: true,
              name_ar: true,
              name_en: true,
            }
          }
        }
      });
      return ResponseUtil.success('Find Country By ID', country);
    } catch (error) {
      this.logger.error(`Error In Find Country By ID: ${error.message}`, error.stack);
      return ResponseUtil.error('An error occurred while searching for country', 'FIND_ONE_FAILED', error?.message);
    }
  }

  async create(data: CreateCountryDto): Promise<unknown> {
    try {
      const country = await this._prismaService.country.create({
        data: {
          name_ar: data.name_ar,
          name_en: data.name_en,
        },
      });
      return ResponseUtil.success('Country Created', country);
    } catch (error) {
      this.logger.error(`Error In Create Country: ${error.message}`, error.stack);
      return ResponseUtil.error('An error occurred while creating country', 'CREATE_FAILED', error?.message);
    }
  }

  async update(id: number, data: CreateCountryDto): Promise<unknown> {
    try {
      const country = await this._prismaService.country.update({
        where: { id: Number(id) },
        data: {
          name_ar: data.name_ar,
          name_en: data.name_en,
        },
      });
      return ResponseUtil.success('Country Updated', country);
    } catch (error) {
      this.logger.error(`Error In Update Country: ${error.message}`, error.stack);
      return ResponseUtil.error('An error occurred while updating country', 'UPDATE_FAILED', error?.message);
    }
  }

  async remove(id: number): Promise<unknown> {
    try {
      const country = await this._prismaService.country.update({
        where: { id: Number(id) },
        data: {
          deleted_at: new Date(),
        },
      });
      return ResponseUtil.success('Country Deleted', country);
    } catch (error) {
      this.logger.error(`Error In Delete Country: ${error.message}`, error.stack);
      return ResponseUtil.error('An error occurred while deleting country', 'DELETE_FAILED', error?.message);
    }
  }
}

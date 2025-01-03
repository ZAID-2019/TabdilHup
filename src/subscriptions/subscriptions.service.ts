import { Injectable, Logger } from '@nestjs/common';
import { ResponseUtil } from 'src/common/response.util';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateSubscriptionDTO } from './create-subscription.dto';

@Injectable()
export class SubscriptionsService {
  constructor(private readonly _prismaService: PrismaService) {}

  private readonly logger = new Logger(SubscriptionsService.name); // Initializes logger with the class name

  async findAll(limit?: number, offset?: number): Promise<unknown> {
    try {
      limit = Number(limit) || 10;
      offset = Number(offset) || 0;
      const [subscriptions, total] = await Promise.all([
        this._prismaService.subscription.findMany({
          where: { deleted_at: null, category: 'REGULAR' },
          take: limit,
          skip: offset,
          select: {
            id: true,
            title_ar: true,
            title_en: true,
            description_ar: true,
            description_en: true,
            price: true,
            offer_price: true,
            category: true,
            status: true,
            created_at: true,
            updated_at: true,
            subscription_options: {
              where: { deleted_at: null },
              select: {
                id: true,
                name_ar: true,
                name_en: true,
              },
            },
          },
          orderBy: {
            created_at: 'desc',
          },
        }),
        this._prismaService.subscription.count({
          where: { deleted_at: null },
        }),
      ]);

      this.logger.verbose(`Successfully Retrieved ${subscriptions.length} Subscriptions`);
      return { subscriptions, total, status: 'success', message: 'Find All Subscriptions' };
    } catch (error) {
      this.logger.error(`Error In Find All Subscriptions: ${error.message}`, error.stack);
      return ResponseUtil.error(
        'An error occurred while searching for Subscriptions',
        'FIND_ALL_FAILED',
        error?.message,
      );
    }
  }

  async findOne(id: string): Promise<unknown> {
    try {
      const subscription = await this._prismaService.subscription.findUnique({
        where: { id: id, deleted_at: null },
        select: {
          id: true,
          title_ar: true,
          title_en: true,
          description_ar: true,
          description_en: true,
          price: true,
          offer_price: true,
          category: true,
          status: true,
          created_at: true,
          updated_at: true,
          subscription_options: {
            where: { deleted_at: null },
            select: {
              id: true,
              name_ar: true,
              name_en: true,
            },
          },
        },
      });
      this.logger.verbose(`Successfully Retrieved Subscription with ID: ${id}`);
      return { subscription, status: 'success', message: 'Find Subscriptions' };
    } catch (error) {
      this.logger.error(`Error In Find subscription By ID: ${error.message}`, error.stack);
      return ResponseUtil.error(
        'An error occurred while searching for subscription',
        'FIND_ONE_FAILED',
        error?.message,
      );
    }
  }

  async create(data: CreateSubscriptionDTO): Promise<unknown> {
    try {
      const subscription = await this._prismaService.subscription.create({
        data: {
          title_ar: data.title_ar,
          title_en: data.title_en,
          description_ar: data.description_ar,
          description_en: data.description_en,
          price: data.price,
          offer_price: data.offer_price,
          category: data.category,
          status: data.status,
        },
      });

      if (data.subscription_options && data.subscription_options.length > 0) {
        await this._prismaService.subscriptionsOptions.createMany({
          data: data.subscription_options.map((option: { name_ar: string; name_en: string }) => ({
            name_ar: option.name_ar,
            name_en: option.name_en,
            subscriptions_id: subscription.id, // Reference the item ID from the created item
          })),
        });
      }
      this.logger.verbose(`Successfully Created Subscription with ID: ${subscription.id}`);
      return { subscription, status: 'success', message: 'Subscription Created' };
    } catch (error) {
      this.logger.error(`Error In Create subscription: ${error.message}`, error.stack);
      return ResponseUtil.error('An error occurred while creating subscription', 'CREATE_FAILED', error?.message);
    }
  }

  async update(id: string, data: CreateSubscriptionDTO): Promise<unknown> {
    try {
      // Update the main subscription details
      await this._prismaService.subscription.update({
        where: { id }, // Use UUID instead of Number(id)
        data: {
          title_ar: data.title_ar,
          title_en: data.title_en,
          description_ar: data.description_ar,
          description_en: data.description_en,
          price: data.price,
          offer_price: data.offer_price,
          category: data.category,
          status: data.status,
        },
      });

      if (data.subscription_options && data.subscription_options.length > 0) {
        // Fetch existing options for the subscription
        const existingOptions = await this._prismaService.subscriptionsOptions.findMany({
          where: { subscriptions_id: id }, // Use UUID for filtering
        });

        // Separate the options into "to update", "to create", and "to delete"
        const existingOptionIds = existingOptions.map((option) => option.id);
        const receivedOptionIds = data.subscription_options.map((option: { id?: string }) => option.id).filter(Boolean);

        const toUpdate = data.subscription_options.filter(
          (option: { id?: string }) => option.id && existingOptionIds.includes(option.id),
        );

        const toCreate = data.subscription_options.filter((option: { id?: string }) => !option.id);

        const toDelete = existingOptionIds.filter((id) => !receivedOptionIds.includes(id));

        // Update existing options
        for (const option of toUpdate) {
          await this._prismaService.subscriptionsOptions.update({
            where: { id: option.id },
            data: {
              name_ar: option.name_ar,
              name_en: option.name_en,
            },
          });
        }

        // Create new options
        if (toCreate.length > 0) {
          await this._prismaService.subscriptionsOptions.createMany({
            data: toCreate.map((option) => ({
              name_ar: option.name_ar,
              name_en: option.name_en,
              subscriptions_id: id, // Link to the existing subscription using UUID
            })),
          });
        }

        // Soft delete options
        if (toDelete.length > 0) {
          await this._prismaService.subscriptionsOptions.updateMany({
            where: { id: { in: toDelete } },
            data: { deleted_at: new Date() }, // Set deleted_at timestamp
          });
        }
      }
      this.logger.verbose(`Successfully Updated Subscription with ID: ${id}`);
      const result = await this.findOne(id); // Use UUID for the findOne function
      return result;
    } catch (error) {
      this.logger.error(`Error in updating subscription: ${error.message}`, error.stack);
      return ResponseUtil.error('An error occurred while updating the subscription', 'UPDATE_FAILED', error?.message);
    }
  }

  async remove(id: string): Promise<unknown> {
    try {
      await this._prismaService.subscription.update({
        where: { id: id },
        data: {
          deleted_at: new Date(),
        },
      });
      await this._prismaService.subscriptionsOptions.updateMany({
        where: { subscriptions_id: id },
        data: { deleted_at: new Date() }, // Set deleted_at timestamp
      });
      this.logger.verbose(`Successfully Soft Deleted Subscription with ID: ${id}`);
      return { status: 'success', message: 'Successfully Subscription Soft Deleted' };
    } catch (error) {
      this.logger.error(`Error In Delete subscription: ${error.message}`, error.stack);
      return ResponseUtil.error('An error occurred while deleting subscription', 'DELETE_FAILED', error?.message);
    }
  }
}

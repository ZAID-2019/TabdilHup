import { IsString, IsDecimal, IsEnum, IsOptional, IsDate } from 'class-validator';

// Enums for Subscription Category and Status
enum SubscriptionsCategories {
  REGULAR = 'REGULAR',
  SPONSORED = 'SPONSORED',
}

enum SubscriptionsStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
}

interface SubscriptionOption {
  id?: string;
  name_ar: string;
  name_en: string;
}

export class CreateSubscriptionDTO {
  @IsString()
  id: string; // Unique identifier for the subscription

  @IsString()
  title_ar: string; // Title of the subscription in Arabic

  @IsString()
  title_en: string; // Title of the subscription in English

  @IsString()
  description_ar: string; // Description of the subscription in Arabic

  @IsString()
  description_en: string; // Description of the subscription in English

  @IsDecimal()
  price: number; // Regular price of the subscription

  @IsDecimal()
  offer_price: number; // Discounted or promotional price for the subscription

  @IsEnum(SubscriptionsCategories)
  category: SubscriptionsCategories; // Enum to categorize the subscription

  @IsEnum(SubscriptionsStatus)
  status: SubscriptionsStatus; // Enum to indicate if the subscription is ACTIVE or INACTIVE

  @IsOptional()
  subscription_options:SubscriptionOption[]; // Array of subscription options

  @IsDate()
  created_at?: Date; // Timestamp for when the subscription was created

  @IsDate()
  @IsOptional()
  updated_at?: Date; // Auto-updated timestamp when the subscription is modified

  @IsDate()
  @IsOptional()
  deleted_at?: Date; // Optional timestamp for soft deletion
}


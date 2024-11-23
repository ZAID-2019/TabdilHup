import { IsString, IsDecimal, IsEnum, IsInt, IsOptional, IsDate } from 'class-validator';

// Enums for Subscription Category and Status
enum SubscriptionsCategories {
  REGULAR = 'REGULAR',
  SPONSORED = 'SPONSORED',
  // Add other categories if needed
}

enum SubscriptionsStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  // Add other statuses if needed
}

interface SubscriptionOption {
  id?: number;
  name_ar: string;
  name_en: string;
}

export class CreateSubscriptionDTO {
  @IsInt()
  id: number; // Unique identifier for the subscription

  @IsString()
  title_ar: string; // Title of the subscription in Arabic

  @IsString()
  title_en: string; // Title of the subscription in English

  @IsString()
  description_ar: string; // Description of the subscription in Arabic

  @IsString()
  description_en: string; // Description of the subscription in English

  @IsString()
  image_url: string; // URL of the image associated with the subscription

  @IsDecimal()
  price: number; // Regular price of the subscription

  @IsDecimal()
  offer_price: number; // Discounted or promotional price for the subscription

  @IsEnum(SubscriptionsCategories)
  category: SubscriptionsCategories; // Enum to categorize the subscription

  @IsEnum(SubscriptionsStatus)
  status: SubscriptionsStatus; // Enum to indicate if the suscription is ACTIVE or INACTIVE

  
  @IsOptional()
  SubscriptionsOptions:SubscriptionOption[]; // Array of subscription options

  @IsDate()
  created_at: Date; // Timestamp for when the subscription was created

  @IsDate()
  @IsOptional()
  updated_at?: Date; // Auto-updated timestamp when the subscription is modified

  @IsDate()
  @IsOptional()
  deleted_at?: Date; // Optional timestamp for soft deletion
}


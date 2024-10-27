// src/items/dto/create-item.dto.ts
import { IsArray, IsBoolean, IsDate, IsDecimal, IsInt, IsOptional, IsString } from 'class-validator';
import { Type } from 'class-transformer';

export enum ItemCondition {
  NEW = 'NEW',
  LIKE_NEW = 'LIKE_NEW',
  GOOD = 'GOOD',
  FAIR = 'FAIR',
  DAMAGED = 'DAMAGED',
  NOT_WORKING = 'NOT_WORKING',
}
export class CreateItemDto {
  @IsString()
  title: string;

  @IsString()
  description: string;

  @IsDecimal()
  trade_value: string; // Prisma Decimal values can be represented as strings

  @IsString()
  condition: ItemCondition; // Adjust this if you are using an enum for ItemCondition

  @IsInt()
  city_id: number;

  @IsInt()
  country_id: number;

  @IsInt()
  user_id: number;

  @IsBoolean()
  @IsOptional()
  is_panner?: boolean;

  @IsDate()
  @Type(() => Date)
  created_at: Date;

  @IsDate()
  @Type(() => Date)
  @IsOptional()
  updated_at?: Date;

  @IsDate()
  @Type(() => Date)
  @IsOptional()
  deleted_at?: Date;

  @IsInt()
  category_id: number;

  @IsArray()
  image_urls?: string[]; // Array of image URLs to associate with the item
}

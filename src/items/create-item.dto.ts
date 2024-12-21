import { IsArray, IsBoolean, IsDate, IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';
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
  @IsNotEmpty({ message: 'title is required' })
  title: string;

  @IsString()
  @IsNotEmpty({ message: 'description is required' })
  description: string;

  @IsNumber()
  @IsNotEmpty({ message: 'trade_value is required' })
  trade_value: number;

  @IsString()
  @IsNotEmpty({ message: 'condition is required' })
  condition: ItemCondition;

  @IsString()
  @IsNotEmpty({ message: 'city_id is required' })
  city_id: string;

  @IsString()
  @IsNotEmpty({ message: 'country_id is required' })
  country_id: string;

  @IsString()
  @IsNotEmpty({ message: 'user_id is required' })
  user_id: string;

  @IsBoolean()
  @IsOptional()
  is_banner?: boolean;

  @IsDate()
  @Type(() => Date)
  @IsOptional()
  created_at: Date;

  @IsDate()
  @Type(() => Date)
  @IsOptional()
  updated_at?: Date;

  @IsDate()
  @Type(() => Date)
  @IsOptional()
  deleted_at?: Date;

  @IsString()
  @IsNotEmpty({ message: 'category_id is required' })
  category_id: string;


  @IsString()
  @IsNotEmpty({ message: 'subcategory_id is required' })
  subcategory_id: string;

  @IsArray()
  image_urls?: string[];

  @IsDate()
  @Type(() => Date)
  @IsOptional()
  start_date?: Date;

  @IsDate()
  @Type(() => Date)
  @IsOptional()
  end_date?: Date;
}

import { IsString, IsInt, IsOptional } from 'class-validator';

export class CreateCategoryDto {
  @IsString()
  name_ar: string;

  @IsString()
  name_en: string;

  @IsString()
  description_ar?: string;

  @IsString()
  description_en?: string;

  @IsString()
  @IsOptional()
  image_url?: string;

  @IsInt()
  @IsOptional()
  parent_id?: number;
}

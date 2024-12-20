import { IsString, IsOptional, IsNotEmpty } from 'class-validator';

export class CreateCategoryDto {
  @IsString()
  @IsNotEmpty({ message: 'Name Ar is required' })
  name_ar: string;

  @IsString()
  @IsNotEmpty({ message: 'Name En is required' })
  name_en: string;

  @IsString()
  @IsNotEmpty({ message: 'Description Ar is required' })
  description_ar?: string;

  @IsString()
  @IsNotEmpty({ message: 'Description En is required' })
  description_en?: string;

  @IsString()
  @IsOptional()
  image_url?: string;

  @IsString()
  @IsOptional()
  parent_id?: string;
}

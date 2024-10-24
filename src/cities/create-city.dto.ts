import { IsString, IsInt } from 'class-validator';

export class CreateCityDto {
  @IsString()
  name_ar: string;

  @IsString()
  name_en: string;

  @IsInt()
  country_id: number;
}

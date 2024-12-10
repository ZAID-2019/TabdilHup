import { IsString } from 'class-validator';

export class CreateCityDto {
  @IsString()
  name_ar: string;

  @IsString()
  name_en: string;

  @IsString()
  country_id: string;
}

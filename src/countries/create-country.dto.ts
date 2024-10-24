import { IsString } from 'class-validator';

export class CreateCountryDto {
  @IsString()
  name_ar: string;

  @IsString()
  name_en: string;
}

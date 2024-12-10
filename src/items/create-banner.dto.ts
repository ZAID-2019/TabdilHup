import { Type } from 'class-transformer';
import { IsBoolean, IsDate, IsOptional} from 'class-validator';

export class CreateBannerDto {
  @IsBoolean()
  is_active?: boolean;

  @IsDate()
  @Type(() => Date)
  @IsOptional()
  start_date?: Date;

  @IsDate()
  @Type(() => Date)
  @IsOptional()
  end_date?: Date;
}

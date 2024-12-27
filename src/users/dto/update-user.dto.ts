import { IsEmail, IsEnum, IsOptional, IsPhoneNumber, IsString, IsDateString } from 'class-validator';
import { Gender, UserRoles, UserStatus } from '@prisma/client';

export class UpdateUserDto {
  @IsString()
  @IsOptional()
  first_name: string;

  @IsString()
  @IsOptional()
  last_name: string;

  @IsString()
  @IsOptional()
  username: string;

  @IsEmail()
  @IsOptional()
  email: string;

  @IsString()
  @IsOptional({ message: 'Password is required' })
  password: string;

  @IsEnum(Gender)
  @IsOptional()
  gender: Gender;

  @IsEnum(UserRoles)
  @IsOptional()
  role: UserRoles = UserRoles.USER;

  @IsEnum(UserStatus)
  @IsOptional()
  status?: UserStatus = UserStatus.ACTIVE;

  @IsPhoneNumber(null)
  @IsOptional()
  phone_number?: string;

  @IsString()
  @IsOptional()
  profile_picture?: string;

  @IsString()
  @IsOptional()
  personal_identity_picture?: string;

  @IsDateString()
  @IsOptional()
  birth_date?: Date;

  @IsString()
  @IsOptional()
  address?: string;

  @IsOptional()
  city_id?: string;

  @IsOptional()
  country_id?: string;
}

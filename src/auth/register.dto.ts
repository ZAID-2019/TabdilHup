import { IsEmail, IsEnum, IsOptional, IsString, IsNotEmpty, IsDateString } from 'class-validator';
import { Gender, UserRoles, UserStatus } from '@prisma/client';

export class RegisterDto {
  @IsString()
  @IsNotEmpty()
  first_name: string;

  @IsString()
  @IsNotEmpty()
  last_name: string;

  @IsString()
  @IsNotEmpty()
  username: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  password: string;

  @IsEnum(Gender)
  @IsNotEmpty()
  gender: Gender;

  @IsEnum(UserRoles)
  @IsNotEmpty()
  role: UserRoles = UserRoles.USER;

  @IsEnum(UserStatus)
  @IsNotEmpty()
  status: UserStatus = UserStatus.ACTIVE;

  @IsNotEmpty()
  phone_number: string;

  @IsString()
  @IsOptional()
  profile_picture?: string;

  @IsString()
  @IsOptional()
  personal_identity_picture?: string;

  @IsDateString()
  @IsNotEmpty()
  birth_date: Date;

  @IsString()
  @IsNotEmpty()
  address: string;

  @IsString()
  @IsNotEmpty()
  city_id: string;

  @IsString()
  @IsNotEmpty()
  country_id: string;
}

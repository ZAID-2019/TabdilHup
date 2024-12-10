import { IsEmail, IsEnum, IsOptional, IsPhoneNumber, IsString, IsNotEmpty, IsDateString } from 'class-validator'; // Import necessary decorators
import { ApiProperty } from '@nestjs/swagger'; // Import Swagger decorator
import { Gender, UserRoles, UserStatus } from '@prisma/client';

export class UpdateUserDto {
  @ApiProperty({ description: "User's first name" }) // Swagger property description
  @IsString() // Ensure it's a string
  @IsNotEmpty() // Must not be empty
  first_name: string; // User's first name

  @ApiProperty({ description: "User's last name" }) // Swagger property description
  @IsString() // Ensure it's a string
  @IsNotEmpty() // Must not be empty
  last_name: string; // User's last name

  @ApiProperty({ description: "Unique username" }) // Swagger property description
  @IsString() // Ensure it's a string
  @IsNotEmpty() // Must not be empty
  username: string; // Unique username

  @ApiProperty({ description: "Unique email address" }) // Swagger property description
  @IsEmail() // Ensure it's a valid email
  @IsNotEmpty() // Must not be empty
  email: string; // Unique email address

  @ApiProperty({ description: "Hashed password" }) // Swagger property description
  @IsString() // Ensure it's a string
  @IsOptional() // Optional field
  password: string; // Hashed password

  @ApiProperty({ enum: Gender, description: "Gender (MALE or FEMALE)" }) // Swagger property description
  @IsEnum(Gender) // Ensure it matches the Gender enum
  gender: Gender; // Gender (MALE or FEMALE)

  @ApiProperty({ enum: UserRoles, description: "User's role", default: UserRoles.USER }) // Swagger property description
  @IsEnum(UserRoles) // Ensure it matches the UserRoles enum
  role?: UserRoles = UserRoles.USER; // User's role (optional, default is USER)

  @ApiProperty({ enum: UserStatus, description: "Account status", default: UserStatus.ACTIVE }) // Swagger property description
  @IsEnum(UserStatus) // Ensure it matches the UserStatus enum
  status?: UserStatus = UserStatus.ACTIVE; // Account status (optional, default is ACTIVE)

  @ApiProperty({ description: "User's phone number", required: false }) // Swagger property description
  @IsPhoneNumber(null) // Ensure it's a valid phone number (country-specific)
  @IsOptional() // Optional field
  phone_number?: string; // User's phone number

  @ApiProperty({ description: "URL to profile picture", required: false }) // Swagger property description
  @IsString() // Ensure it's a string
  @IsOptional() // Optional field
  profile_picture?: string; // URL to profile picture (optional)

  @ApiProperty({ description: "URL to personal identity document", required: false }) // Swagger property description
  @IsString() // Ensure it's a string
  @IsOptional() // Optional field
  personal_identity_picture?: string; // URL to personal identity document (optional)

  @ApiProperty({ description: "User's date of birth , YYYY-MM-DD" }) // Swagger property description
  @IsDateString() // Ensure it's a valid date string
  @IsNotEmpty() // Must not be empty
  birth_date: Date; // User's date of birth

  @ApiProperty({ description: "User's address" }) // Swagger property description
  @IsString() // Ensure it's a string
  @IsNotEmpty() // Must not be empty
  address: string; // User's address

  @ApiProperty({ description: "Reference to the user's city", required: false }) // Swagger property description
  @IsOptional() // Optional field
  city_id?: string; // Reference to the user's city (optional)

  @ApiProperty({ description: "Reference to the user's country", required: false }) // Swagger property description
  @IsOptional() // Optional field
  country_id?: string; // Reference to the user's country (optional)
}
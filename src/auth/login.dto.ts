import { IsNotEmpty, IsString } from 'class-validator';

export class LoginDto {
  @IsNotEmpty()
  @IsString()
  emailOrUsername: string; // Accepts either email or username

  @IsNotEmpty()
  @IsString()
  password: string; // Password for authentication
}
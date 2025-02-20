import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './register.dto';
import { LoginDto } from './login.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly _authService: AuthService) {}

  // Registration Endpoint
  @Post('register')
  async register(@Body() registerData: RegisterDto) {
    return await this._authService.register(registerData);
  }

  @Post('login')
  async login(@Body() loginData: LoginDto) {
    return this._authService.login(loginData.emailOrUsername, loginData.password);
  }


  @Get('check-username')
  async checkUsername(@Query('username') username: string) {
    return this._authService.checkUsername(username); // Directly call service function
  }

  @Get('check-email')
  async checkEmail(@Query('email') email: string) {
    return this._authService.checkEmail(email); // Directly call service function
  }

  // // Login Endpoint
  // @Post('login')
  // async login(
  //   @Body() loginDto: LoginDto,
  // ): Promise<{ token: string }> {
  //   return this.authService.login(loginDto.email, loginDto.password);
  // }

  // // Protected Route Example
  // @UseGuards(JwtAuthGuard)
  // @Get('profile')
  // async getProfile(@Request() req): Promise<{ userId: string; email: string }> {
  //   return req.user; // Payload from JWT token
  // }
}

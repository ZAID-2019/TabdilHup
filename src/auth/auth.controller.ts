import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './register.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly _authService: AuthService) {}

  // Registration Endpoint
  @Post('register')
  async register(@Body() data: RegisterDto){
    return await this._authService.register(data);
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

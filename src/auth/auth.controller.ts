import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './register.dto';

@Controller('auth')
export class AuthController {
  constructor(private _authService: AuthService) {}


  @Post('register')
    async register(@Body() data: RegisterDto) {
        return this._authService.register(data);
    }
}

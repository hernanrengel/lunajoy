import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { GoogleLoginDto } from './dto/google-login.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly auth: AuthService) {}

  @Post('google')
  async google(@Body() dto: GoogleLoginDto) {
    return this.auth.loginWithGoogle(dto.idToken);
  }
}

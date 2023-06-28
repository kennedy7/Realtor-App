import { Body, Controller, Post } from '@nestjs/common';
import { userType } from '@prisma/client';
import { SignInDto, SignUpDto } from '../dtos/auth.dto';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  @Post('signup')
  signup(@Body() signUpDto: SignUpDto) {
    return this.authService.signup(signUpDto);
  }
  @Post('signin')
  signin(@Body() signInDto: SignInDto) {
    return this.authService.signin(signInDto);
  }
  @Post('key')
  generateProductKey(email: string, usertype: userType) {
    return this.authService.generateProductKey(email, usertype);
  }
}

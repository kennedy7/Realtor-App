import {
  Body,
  Controller,
  Param,
  Post,
  ParseEnumPipe,
  UnauthorizedException,
} from '@nestjs/common';
import { userType } from '@prisma/client';
import { GenerateProductKeyDto, SignInDto, SignUpDto } from '../dtos/auth.dto';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  @Post('signup/:userType')
  signup(
    @Body() signUpDto: SignUpDto,
    @Param('usertype', new ParseEnumPipe(userType)) usertype: userType,
  ) {
    if (usertype !== userType.BUYER) {
      if (!signUpDto.productKey) {
        throw new UnauthorizedException();
      }
    }
    return this.authService.signup(signUpDto);
  }
  @Post('signin')
  signin(@Body() signInDto: SignInDto) {
    return this.authService.signin(signInDto);
  }
  @Post('key')
  generateProductKey(@Body() generateProductKeyDto: GenerateProductKeyDto) {
    return this.authService.generateProductKey(generateProductKeyDto);
  }
}

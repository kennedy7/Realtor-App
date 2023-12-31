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
import * as bcrypt from 'bcrypt';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  @Post('signup/:usertype')
  async signup(
    @Body() signUpDto: SignUpDto,
    @Param('usertype', new ParseEnumPipe(userType)) usertype: userType,
  ) {
    if (usertype !== userType.BUYER) {
      if (!signUpDto.productKey) {
        throw new UnauthorizedException();
      }
      const validateProductKey = `${signUpDto.email}-${usertype}-${process.env.PRODUCT_SECRET_KEY}`;
      const isValidProductKey = await bcrypt.compare(
        validateProductKey,
        signUpDto.productKey,
      );
      if (!isValidProductKey) {
        throw new UnauthorizedException();
      }
    }
    return this.authService.signup(signUpDto, usertype);
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

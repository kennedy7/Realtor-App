import { Injectable, ConflictException, HttpException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { SignInDto, SignUpDto } from '../dtos/auth.dto';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import { userType } from '@prisma/client';
import { JwtPayload } from './jwt-strategy';
import { JwtService } from '@nestjs/jwt/dist';

// interface SignUpParams {
//   email: string;
//   phone: string;
//   name: string;
//   password: string;
// }
@Injectable()
export class AuthService {
  constructor(
    private readonly primaService: PrismaService,
    private readonly jwtService: JwtService,
  ) {}
  async signup(signUpDto: SignUpDto): Promise<{ Accesstoken: string }> {
    const { email, password, name, phone } = signUpDto;
    const userExists = await this.primaService.user.findUnique({
      where: { email },
    });
    if (userExists) {
      throw new ConflictException();
    }
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await this.primaService.user.create({
      data: {
        email,
        name,
        phone,
        password: hashedPassword,
        user_Type: userType.BUYER,
      },
    });
    const Accesstoken = await jwt.sign(
      {
        name,
        id: user.id,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: process.env.EXPIRESIN,
      },
    );
    return { Accesstoken };
  }
  async signin(signInDto: SignInDto): Promise<{ AccessToken: string }> {
    const { email, password } = signInDto;
    const user = await this.primaService.user.findUnique({
      where: { email },
    });
    if (!user) {
      throw new HttpException('Invalid credentials', 400);
    }
    const hashedPassword = user.password;
    const isValidPassword = await bcrypt.compare(password, hashedPassword);

    if (!isValidPassword) {
      throw new HttpException('Invalid credentials', 400);
    }
    const payload: JwtPayload = { email };
    const AccessToken = await this.jwtService.sign(payload);
    return { AccessToken };
  }
}

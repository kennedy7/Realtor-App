import { Injectable, ConflictException, HttpException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { GenerateProductKeyDto, SignInDto, SignUpDto } from '../dtos/auth.dto';
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
    private readonly prismaService: PrismaService,
    private readonly jwtService: JwtService,
  ) {}
  async signup(
    signUpDto: SignUpDto,
    usertype: userType,
  ): Promise<{ Accesstoken: string }> {
    const { email, password, name, phone } = signUpDto;
    const userExists = await this.prismaService.user.findUnique({
      where: { email },
    });
    if (userExists) {
      throw new ConflictException();
    }
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await this.prismaService.user.create({
      data: {
        email,
        name,
        phone,
        password: hashedPassword,
        user_Type: usertype,
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
    const user = await this.prismaService.user.findUnique({
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
    const { id, name } = user;
    const payload: JwtPayload = { id, name };
    const AccessToken = await this.jwtService.sign(payload);
    return { AccessToken };
  }
  generateProductKey(generateProductKeyDto: GenerateProductKeyDto) {
    const { email, userType } = generateProductKeyDto;
    const string = `${email}-${userType}-${process.env.PRODUCT_SECRET_KEY}`;
    const key = bcrypt.hash(string, 10);
    return key;
  }
}

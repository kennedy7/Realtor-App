import { Injectable, ConflictException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { SignUpDto } from '../dtos/auth.dto';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import { userType } from '@prisma/client';

// interface SignUpParams {
//   email: string;
//   phone: string;
//   name: string;
//   password: string;
// }
@Injectable()
export class AuthService {
  constructor(private readonly primaService: PrismaService) {}
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
        expiresIn: 3600000,
      },
    );
    return { Accesstoken };
  }
  async signin({ signInDto: SignInDto }) {}
}

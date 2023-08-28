import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import * as dotenv from 'dotenv';
import { PrismaService } from 'src/prisma/prisma.service';
import { User } from '@prisma/client';
dotenv.config();

export interface JwtPayload {
  // email: string;
  id: number;
  name: string;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private prismaService: PrismaService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.JWT_SECRET,
    });
  }

  async validate(payload: JwtPayload): Promise<User> {
    const { id } = payload;
    const user = await this.prismaService.user.findUnique({
      where: { id },
    });
    if (!user) {
      throw new UnauthorizedException();
    }
    return user;
  }
}

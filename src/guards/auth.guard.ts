//allows us access metadata
import { Reflector } from '@nestjs/core';
import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';
import { PrismaService } from 'src/prisma/prisma.service';

interface JWTPayload {
  id: number;
  name: string;
  iat: number;
  exp: number;
}
@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly prismaService: PrismaService,
  ) {}
  async canActivate(context: ExecutionContext) {
    //Getting all the roles from the metadata and replacing the request role
    const roles = this.reflector.getAllAndOverride('roles', [
      context.getHandler(),
      context.getClass(),
    ]);
    if (roles?.length) {
      const request = context.switchToHttp().getRequest();
      const token = request.headers?.authorization?.split('Bearer ')[1];
      try {
        //extracting user details from token in headers
        const payload = (await jwt.verify(
          token,
          process.env.JWT_SECRET,
        )) as JWTPayload;
        //using id from the token to get more details from the prisma DB
        const user = await this.prismaService.user.findUnique({
          where: {
            id: payload.id,
          },
        });
        if (!user) return false;
        if (roles.includes(user.user_Type)) return true;
        return false;
      } catch (error) {
        return false;
      }
    }
    return true;
  }
}

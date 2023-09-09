import { CanActivate, ExecutionContext } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';

//allows us access metadata
import { Reflector } from '@nestjs/core';

export class AuthGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}
  async canActivate(context: ExecutionContext) {
    //Getting all the roles from the metadata and replacing the request role
    const roles = this.reflector.getAllAndOverride('roles', [
      context.getHandler(),
      context.getClass(),
    ]);
    if (roles.length) {
      const request = context.switchToHttp().getRequest();
      const token = request.headers?.authorization?.split('Bearer ')[1];
      try {
        const user = await jwt.verify(token, process.env.JWT_SECRET);
      } catch (error) {
        return false;
      }
    }
    return true;
  }
}

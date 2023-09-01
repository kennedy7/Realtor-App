import { CanActivate, ExecutionContext } from '@nestjs/common';

//allows us access metadata
import { Reflector } from '@nestjs/core';

export class AuthGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}
  canActivate(context: ExecutionContext) {
    //Getting all the roles from the metadata and replacing the request role
    const roles = this.reflector.getAllAndOverride('roles', [
      context.getHandler(),
      context.getClass(),
    ]);
    if (roles.length) {
    }
    return true;
  }
}

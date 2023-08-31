import { CanActivate, ExecutionContext } from '@nestjs/common';

//allows us access metadata
import { Reflector } from '@nestjs/core';

export class AuthGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}
  canActivate(context: ExecutionContext) {
    const roles = this.reflector.getAllAndOverride('roles', [
      context.getHandler(),
      context.getClass(),
    ]);
    return true;
  }
}

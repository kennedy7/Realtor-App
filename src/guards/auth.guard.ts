import { CanActivate } from '@nestjs/common';

//allows us access metadata
import { Reflector } from '@nestjs/core';

export class AuthGuard implements CanActivate {
  canActivate() {
    return true;
  }
}

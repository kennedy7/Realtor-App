import { userType } from '@prisma/client';
import { SetMetadata } from '@nestjs/common/decorators';

export const Roles = (...roles: userType[]) => SetMetadata('roles', roles);

import { Injectable, ConflictException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { SignUpDto } from '../dtos/auth.dto';

interface SignUpParams {
  email: string;
  phone: string;
  name: string;
  password: string;
}
@Injectable()
export class AuthService {
  constructor(private readonly primaService: PrismaService) {}
  async signup({ email }: SignUpParams) {
    const userExists = await this.primaService.user.findUnique({
      where: { email },
    });
    if (userExists) {
      throw new ConflictException();
    }
  }
}

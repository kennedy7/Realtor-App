import { Injectable } from '@nestjs/common';
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
  async signup({email}: SignUpDto) {
    const userExists = this.primaService.user.findUnique({where: {email}})
  }
}

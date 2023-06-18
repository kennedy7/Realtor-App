import { IsString, IsNotEmpty } from 'class-validator';

export class SignUpDto {
  @IsString()
  @IsNotEmpty()
  name: string;
  phone: string;
  email: string;
  password: string;
}

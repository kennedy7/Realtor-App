import {
  IsString,
  IsNotEmpty,
  IsEmail,
  MinLength,
  Matches,
} from 'class-validator';

export class SignUpDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @Matches(/^(\+0?1\s)?\(?\d{3}\)?[\s.-]\d{3}[\s.-]\d{4}$/)
  phone: string;

  @IsEmail()
  email: string;

  @IsString()
  @MinLength(5)
  password: string;
}

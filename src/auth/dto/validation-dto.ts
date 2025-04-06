import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class ValidationDto {
  @IsString()
  @IsNotEmpty()
  sub: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;
}

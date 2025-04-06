import { IsEmail, IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class ViewUserDto {
  @IsNumber()
  @IsNotEmpty()
  id: number;

  @IsString()
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  password: string;

  @IsString()
  @IsNotEmpty()
  username: string;
}

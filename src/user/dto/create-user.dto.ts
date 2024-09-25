import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  readonly name: string;

  @IsString()
  @IsNotEmpty()
  readonly surname: string;

  @IsEmail()
  readonly email: string;

  @IsNotEmpty()
  readonly username: string;

  @IsString()
  @MinLength(8)
  readonly password: string;

  @IsString()
  @MinLength(8)
  readonly repeatPassword: string;
}

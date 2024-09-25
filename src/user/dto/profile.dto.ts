import { IsEmail, IsString } from 'class-validator';

export class ProfileDto {
  @IsString()
  readonly name: string;

  @IsString()
  readonly surname: string;

  @IsString()
  readonly username: string;

  @IsEmail()
  readonly email: string;
}

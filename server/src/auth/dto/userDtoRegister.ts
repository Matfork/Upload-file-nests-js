import { IsString, IsEmail } from 'class-validator';

export class UserDtoRegister {
  @IsString({
    message: 'No es un string',
  })
  @IsEmail()
  readonly email: string;

  @IsString()
  readonly firstName: string;

  @IsString()
  readonly lastName: string;

  readonly role?: string;
}

import { ApiProperty } from '@nestjs/swagger';

export interface ICreateUserDto {
  name: string;
  email: string;
  password: string;
}

export interface ILoginUserDto {
  email: string;
  password: string;
}

export class CreateUserDto {
  @ApiProperty()
  name: string;

  @ApiProperty()
  email: string;

  @ApiProperty()
  password: string;
}

export class LoginUserDto {
  @ApiProperty()
  email: string;

  @ApiProperty()
  password: string;
}

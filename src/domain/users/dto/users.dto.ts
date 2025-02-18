import { ApiProperty } from '@nestjs/swagger';

export interface CreateUserDto {
  name: string;
  email: string;
  password: string;
}

export interface LoginUserDto {
  email: string;
  password: string;
}

export class CreateUserDtoClass {
  @ApiProperty()
  name: string;

  @ApiProperty()
  email: string;

  @ApiProperty()
  password: string;
}

export class LoginUserDtoClass {
  @ApiProperty()
  email: string;

  @ApiProperty()
  password: string;
}

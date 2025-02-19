import { ApiProperty } from '@nestjs/swagger';
export interface ICreateFolderDto {
  name: string;
}

export interface IUpdateFolderDto {
  name: string;
}

export class CreateFolderDto {
  @ApiProperty()
  title: string;

  @ApiProperty()
  notes: string;
}

export class UpdateFolderDto {
  @ApiProperty()
  title: string;

  @ApiProperty()
  notes: string;
}

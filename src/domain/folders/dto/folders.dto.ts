import { ApiProperty } from '@nestjs/swagger';
export interface CreateFolderDto {
  name: string;
}

export interface UpdateFolderDto {
  name: string;
}

export class CreateFolderDtoClass {
  @ApiProperty()
  title: string;

  @ApiProperty()
  notes: string;
}

export class UpdateFolderDtoClass {
  @ApiProperty()
  title: string;

  @ApiProperty()
  notes: string;
}

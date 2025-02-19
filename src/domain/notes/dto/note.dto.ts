import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export interface ICreateNoteDto {
  title: string;
  content: string;
  folderId?: string;
}

export interface IUpdateNoteDto {
  title: string;
  content: string;
  folderId: string;
}

export class CreateNoteDto {
  @ApiProperty()
  title: string;

  @ApiProperty()
  content: string;

  @ApiPropertyOptional()
  folderId: string;
}

export class UpdateNoteDto {
  @ApiPropertyOptional()
  title?: string;

  @ApiPropertyOptional()
  content?: string;

  @ApiPropertyOptional()
  folderId?: string;
}

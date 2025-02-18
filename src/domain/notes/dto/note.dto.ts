import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export interface CreateNoteDto {
  title: string;
  content: string;
  folderId?: string;
}

export interface UpdateNoteDto {
  title: string;
  content: string;
  folderId: string;
}

export class CreateNoteDtoClass {
  @ApiProperty()
  title: string;

  @ApiProperty()
  content: string;

  @ApiPropertyOptional()
  folderId: string;
}

export class UpdateNoteDtoClass {
  @ApiPropertyOptional()
  title?: string;

  @ApiPropertyOptional()
  content?: string;

  @ApiPropertyOptional()
  folderId?: string;
}

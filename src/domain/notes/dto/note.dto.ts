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

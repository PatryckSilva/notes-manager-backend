import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { FoldersModule } from './folders/folders.module';
import { NotesModule } from './notes/notes.module';

@Module({
  imports: [UsersModule, FoldersModule, NotesModule],
})
export class DomainModule {}

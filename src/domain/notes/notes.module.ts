import { Module } from '@nestjs/common';
import { InfraModule } from 'src/infra/infra.module';
import { NotesController } from './notes.controller';
import { PrismaService } from 'src/infra/prisma/prisma.service';
import { NotesRepository } from './notes.repository';
import { NotesService } from './notes.service';
import { ErrorHandlerService } from 'src/infra/error-handler/error-handler.service';
import { UsersRepository } from '../users/users.repository';
import { FoldersRepository } from '../folders/folders.repository';

@Module({
  imports: [InfraModule],
  controllers: [NotesController],
  providers: [
    PrismaService,
    NotesRepository,
    NotesService,
    UsersRepository,
    FoldersRepository,
    ErrorHandlerService,
  ],
  exports: [NotesRepository, NotesService],
})
export class NotesModule {}

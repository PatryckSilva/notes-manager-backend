import { Inject } from '@nestjs/common';
import { NotesRepository } from './notes.repository';
import { ErrorHandlerService } from 'src/infra/error-handler/error-handler.service';
import { CreateNoteDto, UpdateNoteDto } from './dto/note.dto';
import { UserTypes } from '../users/interface/users.interface';
import { StatusCodes } from 'src/infra/error-handler/error-handler.interface';
import { FoldersRepository } from '../folders/folders.repository';

export class NotesService {
  @Inject(FoldersRepository)
  private foldersRepository: FoldersRepository;
  @Inject(NotesRepository)
  private notesRepository: NotesRepository;
  @Inject(ErrorHandlerService)
  private errorHandlerService: ErrorHandlerService;

  async createNote(user: UserTypes, props: CreateNoteDto) {
    const { content, title, folderId } = props;

    if (!user) {
      this.errorHandlerService.dispatch({
        message: 'Usuário deslogado',
        status: StatusCodes.UNAUTHORIZED,
      });
    }
    const findingUsersFolders =
      await this.foldersRepository.findUserFoldersByUserId(user.id);

    const findingAllNotesFolderId =
      findingUsersFolders.find((folder) => folder.name === 'Todas as Notas')
        ?.id || undefined;

    const findingFolderById = folderId
      ? await this.foldersRepository.findFolderById(folderId)
      : undefined;

    let createdNote;

    if (!findingAllNotesFolderId && !findingFolderById) {
      createdNote = await this.notesRepository.createNote({
        title,
        content,
        Folder: {
          create: {
            name: 'Todas as Notas',
            userId: user.id,
          },
        },
        user: {
          connect: {
            ...user,
          },
        },
      });
    }

    if (findingAllNotesFolderId && !findingFolderById) {
      createdNote = await this.notesRepository.createNote({
        title,
        content,
        Folder: {
          connect: {
            id: findingAllNotesFolderId,
          },
        },
        user: {
          connect: {
            ...user,
          },
        },
      });
    }

    if (findingFolderById) {
      createdNote = await this.notesRepository.createNote({
        title,
        content,
        Folder: {
          connect: {
            id: folderId,
          },
        },
        user: {
          connect: {
            ...user,
          },
        },
      });
    }

    if (!createdNote) {
      this.errorHandlerService.dispatch({
        message: 'Erro ao Criar Nota',
        status: StatusCodes.INTERNAL_SERVER_ERROR,
      });
    }

    return createdNote;
  }

  async findUserNotesByUserId(user: UserTypes) {
    if (!user) {
      this.errorHandlerService.dispatch({
        message: 'Usuário deslogado',
        status: StatusCodes.UNAUTHORIZED,
      });
    }

    const notes = await this.notesRepository.findUserNotesByUserId(user.id);

    if (!notes) {
      this.errorHandlerService.dispatch({
        message: 'Erro ao buscar Notas de um usuário',
        status: StatusCodes.INTERNAL_SERVER_ERROR,
      });
    }

    return notes;
  }

  async findNoteById(user: UserTypes, noteId: string) {
    if (!user) {
      this.errorHandlerService.dispatch({
        message: 'Usuário Deslogado',
        status: StatusCodes.UNAUTHORIZED,
      });
    }

    if (!noteId) {
      this.errorHandlerService.dispatch({
        message: 'Id da nota é obrigatório',
        status: StatusCodes.BAD_REQUEST,
      });
    }

    const note = await this.notesRepository.findNoteById(user.id, noteId);

    if (!note) {
      this.errorHandlerService.dispatch({
        message: 'Nota não encontrada',
        status: StatusCodes.NOT_FOUND,
      });
    }

    return note;
  }

  async updateNoteById({
    noteId,
    props,
    user,
  }: {
    user: UserTypes;
    noteId: string;
    props: UpdateNoteDto;
  }) {
    const { content, title, folderId } = props;

    if (!user) {
      this.errorHandlerService.dispatch({
        message: 'Usuário Deslogado',
        status: StatusCodes.UNAUTHORIZED,
      });
    }

    if (!noteId) {
      this.errorHandlerService.dispatch({
        message: 'Id da nota é obrigatório',
        status: StatusCodes.BAD_REQUEST,
      });
    }

    if (folderId) {
      const folder = await this.foldersRepository.findFolderById(folderId);

      if (!folder) {
        this.errorHandlerService.dispatch({
          message: 'Pasta não encontrada',
          status: StatusCodes.NOT_FOUND,
        });
      }
    }

    const note = await this.notesRepository.findNoteById(user.id, noteId);

    if (!note) {
      this.errorHandlerService.dispatch({
        message: 'Nota não encontrada',
        status: StatusCodes.NOT_FOUND,
      });
    }

    const id = folderId ? folderId : note.folderId;
    const updatedNote = await this.notesRepository.updateNoteById({
      data: {
        title,
        content,
        Folder: { connect: { id } },
      },
      noteId,
      userId: user.id,
    });

    if (!updatedNote) {
      this.errorHandlerService.dispatch({
        message: 'Erro ao atualizar Nota',
        status: StatusCodes.INTERNAL_SERVER_ERROR,
      });
    }

    return updatedNote;
  }

  async deleteNoteById(user: UserTypes, noteId: string) {
    if (!user) {
      this.errorHandlerService.dispatch({
        message: 'Usuário Deslogado',
        status: StatusCodes.UNAUTHORIZED,
      });
    }

    if (!noteId) {
      this.errorHandlerService.dispatch({
        message: 'Id da nota é obrigatório',
        status: StatusCodes.BAD_REQUEST,
      });
    }

    const note = await this.notesRepository.findNoteById(user.id, noteId);

    if (!note) {
      this.errorHandlerService.dispatch({
        message: 'Nota não encontrada',
        status: StatusCodes.NOT_FOUND,
      });
    }

    const deletedNote = await this.notesRepository.deleteNoteById(
      user.id,
      noteId,
    );

    if (!deletedNote) {
      this.errorHandlerService.dispatch({
        message: 'Erro ao deletar Nota',
        status: StatusCodes.INTERNAL_SERVER_ERROR,
      });
    }

    return deletedNote;
  }
}

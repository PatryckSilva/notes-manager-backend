import { Inject, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/infra/prisma/prisma.service';
import { ErrorHandlerService } from 'src/infra/error-handler/error-handler.service';
import { StatusCodes } from 'src/infra/error-handler/error-handler.interface';
import { CreateNoteProps, UpdateNoteProps } from './interface/notes.interface';

@Injectable()
export class NotesRepository {
  constructor(private readonly prisma: PrismaService) {}

  @Inject(ErrorHandlerService)
  private errorHandlerService: ErrorHandlerService;

  async createNote(data: CreateNoteProps) {
    try {
      const note = await this.prisma.note.create({
        data,
      });

      return note;
    } catch (error) {
      console.log(error);
      this.errorHandlerService.dispatch({
        message: 'Erro ao criar nota',
        status: StatusCodes.INTERNAL_SERVER_ERROR,
      });
    }
  }

  async findUserNotesByUserId(userId: string) {
    try {
      const note = await this.prisma.note.findMany({
        where: {
          userId,
        },
        select: {
          id: true,
          title: true,
          content: true,
          user: true,
          folderId: true,
        },
      });

      return note;
    } catch (error) {
      console.log(error);
      this.errorHandlerService.dispatch({
        message: 'Erro ao buscar Notas de um usuário',
        status: StatusCodes.INTERNAL_SERVER_ERROR,
      });
    }
  }

  async findNoteById(userId: string, noteId: string) {
    try {
      const note = await this.prisma.note.findUnique({
        where: {
          id: noteId,
          userId,
        },
        select: {
          id: true,
          title: true,
          content: true,
          userId: true,
          folderId: true,
        },
      });

      return note;
    } catch (error) {
      console.log(error);
      this.errorHandlerService.dispatch({
        message: 'Erro ao nota por id',
        status: StatusCodes.INTERNAL_SERVER_ERROR,
      });
    }
  }

  async updateNoteById({
    data,
    noteId,
    userId,
  }: {
    userId: string;
    noteId: string;
    data: UpdateNoteProps;
  }) {
    try {
      const note = await this.prisma.note.update({
        where: {
          id: noteId,
          userId,
        },
        data,
      });

      return note;
    } catch (error) {
      console.log(error);
      this.errorHandlerService.dispatch({
        message: 'Erro ao atualizar nota',
        status: StatusCodes.INTERNAL_SERVER_ERROR,
      });
    }
  }

  async deleteNoteById(userId: string, noteId: string) {
    try {
      const note = await this.prisma.note.delete({
        where: {
          id: noteId,
          userId,
        },
      });

      return note;
    } catch (error) {
      console.log(error);
      this.errorHandlerService.dispatch({
        message: 'Erro ao deletar nota',
        status: StatusCodes.INTERNAL_SERVER_ERROR,
      });
    }
  }
}

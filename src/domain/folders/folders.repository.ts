import { Inject } from '@nestjs/common';
import { StatusCodes } from 'src/infra/error-handler/error-handler.interface';
import { ErrorHandlerService } from 'src/infra/error-handler/error-handler.service';
import { PrismaService } from 'src/infra/prisma/prisma.service';
import {
  CreateFolderProps,
  UpdateFolderProps,
} from './interfaces/folders.interface';

export class FoldersRepository {
  @Inject(PrismaService)
  private prisma: PrismaService;

  @Inject(ErrorHandlerService)
  private errorHandlerService: ErrorHandlerService;

  async findUserFoldersByUserId(userId: string) {
    try {
      const folders = await this.prisma.folder.findMany({
        where: {
          userId,
        },
        select: {
          id: true,
          name: true,
          createdAt: true,
          updatedAt: true,
          notes: {
            select: {
              id: true,
              title: true,
              content: true,
              createdAt: true,
              updatedAt: true,
            },
          },
          userId: true,
        },
      });

      return folders;
    } catch (error) {
      console.log(error);
      this.errorHandlerService.dispatch({
        message: 'Erro ao buscar pastas do usuário',
        status: StatusCodes.INTERNAL_SERVER_ERROR,
      });
    }
  }

  async findFolderById(folderId: string) {
    try {
      const folder = await this.prisma.folder.findUnique({
        where: {
          id: folderId,
        },
        select: {
          id: true,
          name: true,
          createdAt: true,
          updatedAt: true,
          notes: {
            select: {
              id: true,
              title: true,
              content: true,
              createdAt: true,
              updatedAt: true,
            },
          },
          userId: true,
        },
      });

      return folder;
    } catch (error) {
      console.log(error);
      this.errorHandlerService.dispatch({
        message: 'Erro ao buscar pasta',
        status: StatusCodes.INTERNAL_SERVER_ERROR,
      });
    }
  }

  async createFolder(data: CreateFolderProps) {
    try {
      const folder = await this.prisma.folder.create({
        data,
      });

      return folder;
    } catch (error) {
      console.log(error);
      this.errorHandlerService.dispatch({
        message: 'Erro ao criar pasta',
        status: StatusCodes.INTERNAL_SERVER_ERROR,
      });
    }
  }

  async updateFolderById(folderId: string, data: UpdateFolderProps) {
    try {
      const folder = await this.prisma.folder.update({
        where: {
          id: folderId,
        },
        data,
      });

      return folder;
    } catch (error) {
      console.log(error);
      this.errorHandlerService.dispatch({
        message: 'Erro ao atualizar folder',
        status: StatusCodes.INTERNAL_SERVER_ERROR,
      });
    }
  }

  async deleteFolderById(folderId: string) {
    try {
      const folder = await this.prisma.folder.delete({
        where: {
          id: folderId,
        },
      });

      return folder;
    } catch (error) {
      console.log(error);
      this.errorHandlerService.dispatch({
        message: 'Erro ao deletar folder',
        status: StatusCodes.INTERNAL_SERVER_ERROR,
      });
    }
  }
}

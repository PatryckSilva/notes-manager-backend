import { Inject } from '@nestjs/common';
import { ErrorHandlerService } from 'src/infra/error-handler/error-handler.service';
import { UserTypes } from '../users/interface/users.interface';
import { StatusCodes } from 'src/infra/error-handler/error-handler.interface';
import { FoldersRepository } from './folders.repository';
import { CreateFolderDto, UpdateFolderDto } from './dto/folders.dto';

export class FoldersService {
  @Inject(FoldersRepository)
  private foldersRepository: FoldersRepository;
  @Inject(ErrorHandlerService)
  private errorHandlerService: ErrorHandlerService;

  async findUserFolders(userId: string) {
    const folders =
      await this.foldersRepository.findUserFoldersByUserId(userId);

    if (!folders) {
      this.errorHandlerService.dispatch({
        message: 'Erro ao buscar pastas do usuário',
        status: StatusCodes.INTERNAL_SERVER_ERROR,
      });
    }

    return folders;
  }

  async createFolder(user: UserTypes, props: CreateFolderDto) {
    const { name } = props;

    if (!name) {
      this.errorHandlerService.dispatch({
        message: 'Nome da pasta é obrigatório',
        status: StatusCodes.BAD_REQUEST,
      });
    }

    if (!user) {
      this.errorHandlerService.dispatch({
        message: 'Usuário deslogado',
        status: StatusCodes.UNAUTHORIZED,
      });
    }

    const allUserFolders = await this.foldersRepository.findUserFoldersByUserId(
      user.id,
    );

    const existingFolderByName = allUserFolders.some(
      (folder) => folder.name === name,
    );

    if (existingFolderByName) {
      this.errorHandlerService.dispatch({
        message: 'Já existe uma pasta com esse nome para esse usuário',
        status: StatusCodes.BAD_REQUEST,
      });
    }

    const createdFolder = await this.foldersRepository.createFolder({
      name,
      user: {
        connect: {
          id: user.id,
        },
      },
    });

    if (!createdFolder) {
      this.errorHandlerService.dispatch({
        message: 'Erro ao criar pasta',
        status: StatusCodes.INTERNAL_SERVER_ERROR,
      });
    }

    return createdFolder;
  }

  async updateFolder({
    folderId,
    props,
    user,
  }: {
    user: UserTypes;
    folderId: string;
    props: UpdateFolderDto;
  }) {
    if (!user) {
      this.errorHandlerService.dispatch({
        message: 'Usuário deslogado',
        status: StatusCodes.UNAUTHORIZED,
      });
    }

    const folder = await this.foldersRepository.findFolderById(folderId);

    if (!folder) {
      this.errorHandlerService.dispatch({
        message: 'Pasta não encontrada',
        status: StatusCodes.NOT_FOUND,
      });
    }

    const updatedFolder = await this.foldersRepository.updateFolderById(
      folderId,
      props,
    );

    if (!updatedFolder) {
      this.errorHandlerService.dispatch({
        message: 'Erro ao atualizar pasta',
        status: StatusCodes.INTERNAL_SERVER_ERROR,
      });
    }

    return updatedFolder;
  }

  async deleteFolder(user: UserTypes, folderId: string) {
    if (!user) {
      this.errorHandlerService.dispatch({
        message: 'Usuário deslogado',
        status: StatusCodes.UNAUTHORIZED,
      });
    }

    const deletedFolder =
      await this.foldersRepository.deleteFolderById(folderId);

    if (!deletedFolder) {
      this.errorHandlerService.dispatch({
        message: 'Erro ao deletar pasta',
        status: StatusCodes.INTERNAL_SERVER_ERROR,
      });
    }

    return deletedFolder;
  }
}

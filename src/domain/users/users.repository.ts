import { Inject, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/infra/prisma/prisma.service';
import { CreateUserProps } from './interface/users.interface';
import { ErrorHandlerService } from 'src/infra/error-handler/error-handler.service';
import { StatusCodes } from 'src/infra/error-handler/error-handler.interface';

@Injectable()
export class UsersRepository {
  @Inject(PrismaService)
  private prisma: PrismaService;

  @Inject(ErrorHandlerService)
  private errorHandlerService: ErrorHandlerService;

  async createUser(data: CreateUserProps) {
    try {
      const user = await this.prisma.user.create({
        data: {
          ...data,
          folders: {
            create: {
              name: 'Todas as Notas',
            },
          },
        },
      });

      return user;
    } catch (error) {
      console.log(error);
      this.errorHandlerService.dispatch({
        message: 'Erro ao criar conta',
        status: StatusCodes.INTERNAL_SERVER_ERROR,
      });
    }
  }

  async findUserByEmail(email: string) {
    try {
      const user = await this.prisma.user.findUnique({
        where: {
          email,
        },
      });

      return user;
    } catch (error) {
      console.log(error);
      this.errorHandlerService.dispatch({
        message: 'Erro ao buscar conta',
        status: StatusCodes.INTERNAL_SERVER_ERROR,
      });
    }
  }

  async findUserById(id: string) {
    try {
      const user = await this.prisma.user.findUnique({
        where: {
          id,
        },
      });

      return user;
    } catch (error) {
      console.log(error);
      this.errorHandlerService.dispatch({
        message: 'Erro ao buscar conta',
        status: StatusCodes.INTERNAL_SERVER_ERROR,
      });
    }
  }
}

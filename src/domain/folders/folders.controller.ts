import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpException,
  Inject,
  Param,
  Patch,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/guards/jwt-auth-guard.guard';
import { FoldersService } from './folders.service';
import { CreateFolderDto, UpdateFolderDto } from './dto/folders.dto';
import { AuthenticatedRequest } from '../users/interface/users.interface';
import { StatusCodes } from 'src/infra/error-handler/error-handler.interface';

@Controller('folders')
export class FoldersController {
  @Inject(FoldersService)
  private foldersService: FoldersService;

  @Get('')
  @HttpCode(StatusCodes.OK)
  @UseGuards(JwtAuthGuard)
  async getUserFolders(@Req() request: AuthenticatedRequest, @Res() res) {
    try {
      const user = request.user;
      const folders = await this.foldersService.findUserFolders(user.id);

      res.status(StatusCodes.OK).send(folders);
    } catch (error) {
      throw new HttpException(
        {
          statusCode: error.status || 500,
          message: error.message,
        },
        error.status || 500,
      );
    }
  }

  @Get('/by-id/:id')
  @HttpCode(StatusCodes.OK)
  @UseGuards(JwtAuthGuard)
  async getFolderById(
    @Req() request: AuthenticatedRequest,
    @Param('id') id: string,
    @Res() res,
  ) {
    try {
      const user = request.user;
      const folder = await this.foldersService.findFolderById(user.id, id);

      res.status(StatusCodes.OK).send(folder);
    } catch (error) {
      throw new HttpException(
        {
          statusCode: error.status || 500,
          message: error.message,
        },
        error.status || 500,
      );
    }
  }

  @Post('create')
  @HttpCode(StatusCodes.CREATED)
  @UseGuards(JwtAuthGuard)
  async createFolder(
    @Req() request: AuthenticatedRequest,
    @Body() data: CreateFolderDto,
    @Res() res,
  ) {
    const user = request.user;
    try {
      const createdFolder = await this.foldersService.createFolder(user, data);

      res
        .status(StatusCodes.CREATED)
        .send({ message: 'Pasta criada com sucesso', folder: createdFolder });
    } catch (error) {
      throw new HttpException(
        {
          statusCode: error.status || 500,
          message: error.message,
        },
        error.status || 500,
      );
    }
  }

  @Patch('update/:id')
  @HttpCode(StatusCodes.OK)
  @UseGuards(JwtAuthGuard)
  async updateFolder(
    @Req() request: AuthenticatedRequest,
    @Param('id') id: string,
    @Body() data: UpdateFolderDto,
    @Res() res,
  ) {
    const user = request.user;
    try {
      const folder = await this.foldersService.updateFolder({
        user,
        folderId: id,
        props: data,
      });

      res
        .status(StatusCodes.OK)
        .send({ message: 'Pasta atualizada com sucesso', folder });
    } catch (error) {
      throw new HttpException(
        {
          statusCode: error.status || 500,
          message: error.message,
        },
        error.status || 500,
      );
    }
  }

  @Delete('delete/:id')
  @HttpCode(StatusCodes.OK)
  @UseGuards(JwtAuthGuard)
  async deleteFolder(
    @Req() request: AuthenticatedRequest,
    @Param('id') id: string,
    @Res() res,
  ) {
    const user = request.user;
    try {
      await this.foldersService.deleteFolder(user, id);

      res
        .status(StatusCodes.OK)
        .send({ message: 'Pasta deletada com sucesso' });
    } catch (error) {
      throw new HttpException(
        {
          statusCode: error.status || 500,
          message: error.message,
        },
        error.status || 500,
      );
    }
  }
}

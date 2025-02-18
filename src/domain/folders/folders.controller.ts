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
import {
  CreateFolderDto,
  CreateFolderDtoClass,
  UpdateFolderDto,
  UpdateFolderDtoClass,
} from './dto/folders.dto';
import { AuthenticatedRequest } from '../users/interface/users.interface';
import { StatusCodes } from 'src/infra/error-handler/error-handler.interface';
import { ApiBody, ApiParam, ApiTags } from '@nestjs/swagger';

@Controller('folders')
export class FoldersController {
  @Inject(FoldersService)
  private foldersService: FoldersService;

  @Get('')
  @HttpCode(StatusCodes.OK)
  @UseGuards(JwtAuthGuard)
  @ApiTags('Folders')
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
  @ApiTags('Folders')
  @ApiParam({ name: 'id', type: String })
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
  @ApiTags('Folders')
  @ApiBody({ required: true, type: CreateFolderDtoClass })
  async createFolder(
    @Req() request: AuthenticatedRequest,
    @Body() data: CreateFolderDto,
    @Res() res,
  ) {
    const user = request.user;
    const firstKey = Object.keys(data)[0];

    const body = JSON.parse(firstKey);
    try {
      const createdFolder = await this.foldersService.createFolder(user, body);

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
  @ApiTags('Folders')
  @ApiBody({ required: true, type: UpdateFolderDtoClass })
  @ApiParam({ name: 'id', type: String })
  async updateFolder(
    @Req() request: AuthenticatedRequest,
    @Param('id') id: string,
    @Body() data: UpdateFolderDto,
    @Res() res,
  ) {
    const user = request.user;
    const firstKey = Object.keys(data)[0];

    const body = JSON.parse(firstKey);
    try {
      const folder = await this.foldersService.updateFolder({
        user,
        folderId: id,
        props: body,
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
  @ApiTags('Folders')
  @ApiParam({ name: 'id', type: String })
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

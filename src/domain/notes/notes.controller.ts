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
import { CreateNoteDto, UpdateNoteDto } from './dto/note.dto';
import { NotesService } from './notes.service';
import { AuthenticatedRequest } from '../users/interface/users.interface';
import { StatusCodes } from 'src/infra/error-handler/error-handler.interface';

@Controller('notes')
export class NotesController {
  @Inject(NotesService)
  private notesService: NotesService;

  @Get('')
  @UseGuards(JwtAuthGuard)
  async getUserNotes(@Req() request: AuthenticatedRequest, @Res() res) {
    try {
      const user = request.user;

      const response = await this.notesService.findUserNotesByUserId(user);

      console.log(`response`, response);

      res.status(StatusCodes.OK).send(response);
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

  @Get('/by-id/:noteId')
  @UseGuards(JwtAuthGuard)
  async getNoteById(
    @Req() request: AuthenticatedRequest,
    @Param('noteId') noteId: string,
    @Res() res,
  ) {
    try {
      const user = request.user;

      const response = await this.notesService.findNoteById(user, noteId);

      res.status(StatusCodes.OK).send(response);
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
  @HttpCode(201)
  @UseGuards(JwtAuthGuard)
  async createNote(
    @Req() request: AuthenticatedRequest,
    @Body() data: CreateNoteDto,
    @Res() res,
  ) {
    try {
      const user = request.user;
      const firstKey = Object.keys(data)[0];

      const body = JSON.parse(firstKey);
      const response = await this.notesService.createNote(user, body);

      res.status(StatusCodes.CREATED).send(response);
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

  @Patch('update/:noteId')
  @HttpCode(200)
  @UseGuards(JwtAuthGuard)
  async updateNote(
    @Req() request: AuthenticatedRequest,
    @Param('noteId') noteId: string,
    @Body() data: UpdateNoteDto,
    @Res() res,
  ) {
    try {
      const user = request.user;

      const firstKey = Object.keys(data)[0];

      const body = JSON.parse(firstKey);

      const response = await this.notesService.updateNoteById({
        noteId,
        props: body,
        user,
      });

      res.status(StatusCodes.OK).send(response);
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

  @Delete('delete/:noteId')
  @HttpCode(204)
  @UseGuards(JwtAuthGuard)
  async deleteNote(
    @Req() request: AuthenticatedRequest,
    @Param('noteId') noteId: string,
    @Res() res,
  ) {
    try {
      const user = request.user;
      const response = await this.notesService.deleteNoteById(user, noteId);

      res.status(StatusCodes.OK).send(response);
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

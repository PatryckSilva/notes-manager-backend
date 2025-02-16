import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpException,
  Inject,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto, LoginUserDto } from './dto/users.dto';
import { JwtAuthGuard } from 'src/guards/jwt-auth-guard.guard';
import { AuthenticatedRequest } from './interface/users.interface';
import { StatusCodes } from 'src/infra/error-handler/error-handler.interface';
import { Request, Response } from 'express';

@Controller('users')
export class UsersController {
  @Inject(UsersService)
  private usersService: UsersService;

  @Get('')
  @HttpCode(200)
  @UseGuards(JwtAuthGuard)
  async getUser(@Req() request: AuthenticatedRequest, @Res() res) {
    try {
      const user = request.user;
      const response = await this.usersService.findUserById(user.id);

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

  @Get('by-email')
  @HttpCode(200)
  @UseGuards(JwtAuthGuard)
  async getUserByEmail(@Req() request: AuthenticatedRequest, @Res() res) {
    try {
      const user = request.user;
      const response = await this.usersService.findUserByEmail(user.email);

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
  async createUser(@Body() data: CreateUserDto, @Res() res) {
    try {
      const response = await this.usersService.createUser(data);

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

  @Post('login')
  @HttpCode(200)
  async login(
    @Req() request: Request,
    @Body() data: LoginUserDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    try {
      const token = await this.usersService.login(data);

      res.status(StatusCodes.OK).send({ token });
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

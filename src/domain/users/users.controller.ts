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
import {
  CreateUserDto,
  CreateUserDtoClass,
  LoginUserDto,
  LoginUserDtoClass,
} from './dto/users.dto';
import { JwtAuthGuard } from 'src/guards/jwt-auth-guard.guard';
import { AuthenticatedRequest } from './interface/users.interface';
import { StatusCodes } from 'src/infra/error-handler/error-handler.interface';
import { Request, Response } from 'express';
import { ApiBearerAuth, ApiBody, ApiTags } from '@nestjs/swagger';

@Controller('users')
export class UsersController {
  @Inject(UsersService)
  private usersService: UsersService;

  @Get('')
  @HttpCode(StatusCodes.OK)
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiTags('Users')
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
  @HttpCode(StatusCodes.OK)
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiTags('Users')
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
  @HttpCode(StatusCodes.CREATED)
  @ApiTags('Users')
  @ApiBody({ required: true, type: CreateUserDtoClass })
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
  @HttpCode(StatusCodes.OK)
  @ApiTags('Users')
  @ApiBody({ required: true, type: LoginUserDtoClass })
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

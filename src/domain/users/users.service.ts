import { Inject, Injectable } from '@nestjs/common';
import { UsersRepository } from './users.repository';
import { LoginUserProps } from './interface/users.interface';
import { EncryptService } from 'src/infra/encrypt/encrypt.service';
import { TokenService } from 'src/infra/token/token.service';
import { CreateUserDto } from './dto/users.dto';
import { ErrorHandlerService } from 'src/infra/error-handler/error-handler.service';
import { StatusCodes } from 'src/infra/error-handler/error-handler.interface';
import { FoldersRepository } from '../folders/folders.repository';

@Injectable()
export class UsersService {
  @Inject(UsersRepository)
  private usersRepository: UsersRepository;
  @Inject(EncryptService)
  private encryptService: EncryptService;
  @Inject(TokenService)
  private tokenService: TokenService;
  @Inject(ErrorHandlerService)
  private errorHandlerService: ErrorHandlerService;
  @Inject(FoldersRepository)
  private foldersRepository: FoldersRepository;

  async createUser(props: CreateUserDto) {
    const { name, email, password } = props;

    if (!name?.trim() || !email?.trim() || !email?.includes('@')) {
      this.errorHandlerService.dispatch({
        message: 'Nome ou email inválidos',
        status: StatusCodes.BAD_REQUEST,
      });
    }

    if (!password) {
      this.errorHandlerService.dispatch({
        message: 'Senha inválida',
        status: StatusCodes.BAD_REQUEST,
      });
    }

    if (!password.trim() || password.trim().length < 8) {
      this.errorHandlerService.dispatch({
        message: 'A senha deve conter no mínimo 8 caracteres',
        status: StatusCodes.BAD_REQUEST,
      });
    }

    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]{8,}$/;

    if (!passwordRegex.test(password)) {
      this.errorHandlerService.dispatch({
        message:
          'A senha deve conter pelo menos uma letra maiúscula, uma letra minúscula, um número e um caractere especial',
        status: StatusCodes.BAD_REQUEST,
      });
    }

    const existingUser = await this.usersRepository.findUserByEmail(email);

    if (existingUser) {
      this.errorHandlerService.dispatch({
        message: 'Email já cadastrado',
        status: StatusCodes.BAD_REQUEST,
      });
    }

    const passwordHash = this.encryptService.generateHash(password);

    const user = await this.usersRepository.createUser({
      name,
      email,
      password: passwordHash,
    });

    if (!user) {
      this.errorHandlerService.dispatch({
        message: 'Erro ao criar a conta',
        status: StatusCodes.INTERNAL_SERVER_ERROR,
      });
    }

    return {
      message: 'Conta criada com sucesso',
    };
  }

  async login({ email, password }: LoginUserProps) {
    if (!email?.trim() || !email?.includes('@')) {
      this.errorHandlerService.dispatch({
        message: 'Email inválido',
        status: StatusCodes.BAD_REQUEST,
      });
    }

    if (!password) {
      this.errorHandlerService.dispatch({
        message: 'Senha inválida',
        status: StatusCodes.BAD_REQUEST,
      });
    }

    const user = await this.usersRepository.findUserByEmail(email);

    if (!user) {
      this.errorHandlerService.dispatch({
        message: 'Conta não encontrada',
        status: StatusCodes.BAD_REQUEST,
      });
    }

    const decryptedPassword = this.encryptService.decryptHash(user.password);

    if (decryptedPassword !== password) {
      this.errorHandlerService.dispatch({
        message: 'Senha inválida',
        status: StatusCodes.BAD_REQUEST,
      });
    }

    const token = this.tokenService.createToken(user.id);

    return token;
  }

  async findUserByEmail(email: string) {
    if (!email?.trim() || !email?.includes('@')) {
      this.errorHandlerService.dispatch({
        message: 'Email inválido',
        status: StatusCodes.BAD_REQUEST,
      });
    }

    const response = await this.usersRepository.findUserByEmail(email);

    if (!response) {
      this.errorHandlerService.dispatch({
        message: 'Usuário não encontrado',
        status: StatusCodes.NOT_FOUND,
      });
    }

    return response;
  }

  async findUserById(id: string) {
    if (!id) {
      this.errorHandlerService.dispatch({
        message: 'Id inválido',
        status: StatusCodes.BAD_REQUEST,
      });
    }

    const response = await this.usersRepository.findUserById(id);

    if (!response) {
      this.errorHandlerService.dispatch({
        message: 'Usuário não encontrado',
        status: StatusCodes.NOT_FOUND,
      });
    }

    return response;
  }
}

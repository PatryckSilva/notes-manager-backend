import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from '../users.controller';
import { UsersService } from '../users.service';
import { CreateUserDto, LoginUserDto } from '../dto/users.dto';
import { HttpException } from '@nestjs/common';

describe('UsersController', () => {
  let controller: UsersController;
  let service: UsersService;

  const testCreateUserDto: CreateUserDto = {
    name: 'testuser',
    email: 'test@gmail.com',
    password: 'password',
  };

  const testLoginDto: LoginUserDto = {
    email: 'test@gmail.com',
    password: 'password',
  };

  const successCreateResponse = { message: 'User created successfully' };
  const tokenResponse = 'jwt-token';

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useValue: {
            createUser: jest.fn(),
            login: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
    service = module.get<UsersService>(UsersService);
  });

  describe('getUser', () => {
    it('should return the user from the request', async () => {
      const req = { user: { id: 1, username: 'testuser' } } as any;
      const result = await controller.getUser(req);
      expect(result).toEqual(req.user);
    });

    it('should throw an HttpException if an error occurs', async () => {
      const req = {} as any;
      jest.spyOn(controller, 'getUser').mockImplementation(() => {
        throw new HttpException('Error', 500);
      });
      await expect(controller.getUser(req)).rejects.toThrow(HttpException);
    });
  });

  describe('createUser', () => {
    it('should create a user and return the success response', async () => {
      jest
        .spyOn(service, 'createUser')
        .mockResolvedValue(successCreateResponse);
      const result = await controller.createUser(testCreateUserDto);
      expect(result).toEqual(successCreateResponse);
    });

    it('should throw an HttpException if an error occurs during creation', async () => {
      jest
        .spyOn(service, 'createUser')
        .mockRejectedValue(new HttpException('Error', 500));
      await expect(controller.createUser(testCreateUserDto)).rejects.toThrow(
        HttpException,
      );
    });
  });

  describe('login', () => {
    it('should return a token on successful login', async () => {
      jest.spyOn(service, 'login').mockResolvedValue(tokenResponse);
      const result = await controller.login(testLoginDto);
      expect(result).toEqual({ token: tokenResponse });
    });

    it('should throw an HttpException if an error occurs during login', async () => {
      jest
        .spyOn(service, 'login')
        .mockRejectedValue(new HttpException('Error', 500));
      await expect(controller.login(testLoginDto)).rejects.toThrow(
        HttpException,
      );
    });
  });
});

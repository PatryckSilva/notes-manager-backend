import { Module } from '@nestjs/common';
import { PrismaService } from 'src/infra/prisma/prisma.service';
import { UsersRepository } from './users.repository';
import { EncryptService } from 'src/infra/encrypt/encrypt.service';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { InfraModule } from 'src/infra/infra.module';
import { ErrorHandlerService } from 'src/infra/error-handler/error-handler.service';
import { FoldersRepository } from '../folders/folders.repository';

@Module({
  imports: [InfraModule],
  controllers: [UsersController],
  providers: [
    PrismaService,
    EncryptService,
    UsersRepository,
    FoldersRepository,
    UsersService,
    ErrorHandlerService,
  ],
  exports: [UsersRepository, UsersService],
})
export class UsersModule {}

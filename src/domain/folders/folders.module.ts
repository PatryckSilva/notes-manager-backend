import { Module } from '@nestjs/common';
import { InfraModule } from 'src/infra/infra.module';
import { PrismaService } from 'src/infra/prisma/prisma.service';
import { FoldersRepository } from './folders.repository';
import { FoldersService } from './folders.service';
import { ErrorHandlerService } from 'src/infra/error-handler/error-handler.service';
import { FoldersController } from './folders.controller';
import { UsersRepository } from '../users/users.repository';

@Module({
  imports: [InfraModule],
  controllers: [FoldersController],
  providers: [
    PrismaService,
    FoldersRepository,
    UsersRepository,
    FoldersService,
    ErrorHandlerService,
  ],
  exports: [FoldersRepository, FoldersService],
})
export class FoldersModule {}

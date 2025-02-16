import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { EncryptModule } from './encrypt/encrypt.module';
import { TokenModule } from './token/token.module';
import { ErrorHandlerModule } from './error-handler/error-handler.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot(),
    PrismaModule,
    EncryptModule,
    TokenModule,
    ErrorHandlerModule,
  ],
  exports: [PrismaModule, EncryptModule, TokenModule],
})
export class InfraModule {}

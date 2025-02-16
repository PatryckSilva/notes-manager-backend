import { Module } from '@nestjs/common';
import { ErrorHandlerService } from './error-handler.service';

@Module({
  providers: [ErrorHandlerService],
})
export class ErrorHandlerModule {}

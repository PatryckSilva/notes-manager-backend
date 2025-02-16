import { Injectable } from '@nestjs/common';
import { ErrorHandlerProps } from './error-handler.interface';

@Injectable()
export class ErrorHandlerService {
  dispatch({ message, status }: ErrorHandlerProps) {
    throw { message, status };
  }
}

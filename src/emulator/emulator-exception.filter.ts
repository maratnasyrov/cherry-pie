import { Catch, ArgumentsHost } from '@nestjs/common';
import { BaseWsExceptionFilter } from '@nestjs/websockets';
import { AppError, AppException } from '../app.exception';

@Catch()
export class EmulatorExceptionsFilter extends BaseWsExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToWs();
    const client = ctx.getClient();
    let code = exception.code || AppError.Emulator;
    let message = '';
    let id = '';

    if (exception instanceof AppException) {
      id = exception.meta.id;
      code = exception.code;
      message = exception.message;
    }

    client.emit('error', { id, code, message });
  }
}

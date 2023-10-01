import { Catch, ArgumentsHost } from '@nestjs/common';
import { BaseWsExceptionFilter } from '@nestjs/websockets';
import { AppError, AppException } from '../app.exception';

@Catch()
export class EmulatorExceptionsFilter extends BaseWsExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToWs();
    const client = ctx.getClient();
    const data = ctx.getData();

    let id = data.id;
    let code = AppError.Emulator;
    let message = exception.message;

    if (exception instanceof AppException) {
      id = exception.meta.id || id;
      code = exception.code;
      message = exception.meta?.response.message || message;
    }

    client.emit('error', { id, code, message });
  }
}

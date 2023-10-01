import {
  ArgumentsHost,
  BadRequestException,
  Catch,
  ExceptionFilter,
  NotFoundException,
} from '@nestjs/common';
import { Response } from 'express';

import { AppError, AppException } from '../app.exception';

@Catch()
export class ServerExceptionFilter implements ExceptionFilter {
  catch(
    exception: AppException<number> | BadRequestException | NotFoundException,
    host: ArgumentsHost,
  ): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    let code = AppError.Server;
    let message = '';

    if (exception instanceof AppException) {
      code = Number(exception.meta.response.code);
      message = exception.meta.response.message;
    }

    response.status(400).json({ code, message });
  }
}

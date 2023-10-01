import {
  CallHandler,
  ExecutionContext,
  Inject,
  Injectable,
  Logger,
  LoggerService,
  NestInterceptor,
} from '@nestjs/common';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { AppException } from './app.exception';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  constructor(@Inject(Logger) private readonly logger: LoggerService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    return next.handle().pipe(
      catchError((err) => {
        const ctx = context.switchToHttp();
        const request = ctx.getRequest<Request>();

        const msg = {
          ...err,
          message: err.message,
          request: {
            method: request.method,
            url: request.url,
            headers: request.headers,
            body: request.body,
          },
          response: err.meta.response,
        };

        if (err instanceof AppException) {
          this.logger.warn(msg, 'LoggingInterceptor');
        } else {
          this.logger.error(msg, err.stack, 'LoggingInterceptor');
        }

        return throwError(() => err);
      }),
    );
  }
}

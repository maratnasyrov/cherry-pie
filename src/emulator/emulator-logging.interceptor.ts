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
import { EmulatorException } from './emulator.exception';

@Injectable()
export class EmulatorLoggingInterceptor implements NestInterceptor {
  constructor(@Inject(Logger) private readonly logger: LoggerService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    return next.handle().pipe(
      catchError((err) => {
        if (err instanceof EmulatorException) {
          this.logger.warn(err, 'EmulatorLoggingInterceptor');
        } else {
          this.logger.error(err, err.stack, 'EmulatorLoggingInterceptor');
        }

        return throwError(() => err);
      })
    );
  }
}

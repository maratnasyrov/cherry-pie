import { AppError, AppException } from '../app.exception';

export enum SessionError {
  BadRequest = AppError.Session,
  TokenNotFound,
}

export class SessionException extends AppException<SessionError> {}

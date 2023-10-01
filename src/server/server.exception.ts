import { AppError, AppException } from '../app.exception';

export enum ServerError {
  BadRequest = AppError.Server,
}

export class ServerException extends AppException<ServerError> {}

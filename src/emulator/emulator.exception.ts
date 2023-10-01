import { AppError, AppException } from '../app.exception';

export enum EmulatorError {
  BadRequest = AppError.Emulator,
  BetCountNumberIncorrect,
  BetCountNotChanged,
}

export class EmulatorException extends AppException<EmulatorError> {}

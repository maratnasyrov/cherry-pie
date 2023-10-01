export enum AppError {
  Server = 1000,
  Session = 2000,
  Emulator = 3000,
}

export class AppException<T> extends Error {
  constructor(
    public readonly code: T,
    public readonly message: string,
    public readonly meta?: Record<string, any>,
  ) {
    super(message);
  }
}

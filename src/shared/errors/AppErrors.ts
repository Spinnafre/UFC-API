//Emitir erros personalizáveis
export class AppError extends Error {
  public statusCode: number;
  public isOperational: boolean;

  constructor({
    statusCode = 400,
    message = "",
    isOperational = true,
    stack = "",
  }) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = isOperational;
    if (stack) {
      this.stack = stack;
    } else {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}

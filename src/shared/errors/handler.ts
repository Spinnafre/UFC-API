import { Response } from "express";
import { AppError } from "./AppErrors";

export function handleError(err: AppError, res: Response) {
  if (!err.isOperational) {
    console.log("Erro na execução da aplicação - ", err);
    console.log("[KILL] - Parando aplicação");
    //Se não for um Apperror então desliga a aplicação
    process.exit(1);
  }

  return res.status(err.statusCode).json({ msg: err.message });
}

import { NextFunction, Request, Response } from "express";
import { container } from "../app";
import LoggerService from "../servcies/logger.service";
import { ContainerTokens } from "../types/container";

export class CustomError extends Error {
  code: number;
  error: any;

  constructor(message: string, code?: number, error?: any) {
    super(message);
    this.code = code || 500;
    this.error = error;
  }
}

export default function errorMiddleware(
  error: Error,
  req: Request,
  res: Response,
  next: NextFunction
): any {
  const logger = container.get<LoggerService>(ContainerTokens.Logger);
  logger.error(error.message, error.stack);

  if (error instanceof CustomError)
    return res.status(error.code).json({
      success: false,
      message: error.message,
      error: error.error,
    });

  return res.status(500).json({
    success: false,
    message: error.message,
    error,
  });
}

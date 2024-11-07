import { NextFunction, Request, Response } from "express";

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
) {
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
